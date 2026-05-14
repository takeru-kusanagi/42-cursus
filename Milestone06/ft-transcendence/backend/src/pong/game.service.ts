import { getState, createInitialState } from '@shared/pong/engine';
import type { GameState, InputState, GameMode } from '@shared/pong/types';
import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import { MatchStatus } from '@prisma/client';

@Injectable()
export class GameService {
  private games = new Map<string, GameState>();
  private gameInputs = new Map<string, { p1: InputState, p2: InputState }>();
  private playerIds = new Map<string, { p1: string, p2: string }>();
  private intervals = new Map<string, NodeJS.Timeout>();
  public io: Server;

  constructor(private prisma: PrismaService) {}

  // 1. 戻り値の型エラーを修正
  createGame(mode: GameMode, p1Id: string, p2Id: string): { gameId: string, state: GameState } {
    const gameId = crypto.randomUUID();
    const state = createInitialState(mode);
    this.games.set(gameId, state);
    
    this.gameInputs.set(gameId, {
      p1: { w: false, s: false, arrowUp: false, arrowDown: false },
      p2: { w: false, s: false, arrowUp: false, arrowDown: false }
    });

    const interval = setInterval(() => this.tick(gameId), 1000 / 60);
    this.intervals.set(gameId, interval);

    return { gameId, state };
  }

  // フレンドマッチ用
  createGameForMatch(gameId: string, p1Id: string, p2Id: string): GameState {
    const existing = this.games.get(gameId);
    if (existing) return existing;

    const state = createInitialState('onlineMultiplayerWithFriend');
    this.games.set(gameId, state);
    this.playerIds.set(gameId, { p1: p1Id, p2: p2Id });

    this.gameInputs.set(gameId, {
      p1: { w: false, s: false, arrowUp: false, arrowDown: false },
      p2: { w: false, s: false, arrowUp: false, arrowDown: false }
    });

    const interval = setInterval(() => this.tick(gameId), 1000 / 60);
    this.intervals.set(gameId, interval);

    return state;
  }

  applyInput(gameId: string, input: InputState, side: 'p1' | 'p2') {
    const currentInputs = this.gameInputs.get(gameId);
    if (currentInputs) {
      currentInputs[side] = input;
    }
  }

  private async tick(gameId: string) {
    const state = this.games.get(gameId);
    const inputs = this.gameInputs.get(gameId);
    if (!state || !inputs) return;

    const newState = getState(inputs, state); 
    this.games.set(gameId, newState);
    this.io?.to(gameId).emit('state', newState);

    if (newState.status === 'finished') {
      const ids = this.playerIds.get(gameId);
      if (ids) {
        // 保存処理
        this.saveMatchToDb(gameId, ids.p1, ids.p2, newState);
      }
      this.removeGame(gameId);
    }
  }

  private async saveMatchToDb(matchId: string, p1Id: string, p2Id: string, state: GameState) {
  try {
    // 確実に数値で比較
    const p1Score = state.score.p1;
    const p2Score = state.score.p2;
    const p1Win = p1Score > p2Score;
    const p2Win = p2Score > p1Score;
    
    const winnerId = p1Win ? p1Id : p2Id;
    const loserId = p1Win ? p2Id : p1Id;

    console.log(`Final Score - P1(${p1Id}): ${p1Score}, P2(${p2Id}): ${p2Score}`);

    await this.prisma.matchPlayer.upsert({
      where: { 
        matchId_userId: { matchId, userId: p1Id } 
      },
      update: { 
        score: p1Score, 
        isWinner: p1Win 
      },
      create: { 
        matchId, 
        userId: p1Id, 
        score: p1Score, 
        isWinner: p1Win 
      }
    });

    // P2についても同様に upsert に書き換えてください
    await this.prisma.matchPlayer.upsert({
      where: { 
        matchId_userId: { matchId, userId: p2Id } 
      },
      update: { 
        score: p2Score, 
        isWinner: p2Win 
      },
      create: { 
        matchId, 
        userId: p2Id, 
        score: p2Score, 
        isWinner: p2Win 
      }
    });

    // Userの戦績更新
    await this.prisma.user.update({
      where: { id: winnerId },
      data: { wins: { increment: 1 }, rating: { increment: 20 } }
    });
    await this.prisma.user.update({
      where: { id: loserId },
      data: { losses: { increment: 1 }, rating: { decrement: 10 } }
    });
    
    // Match本体を終了にする
    await this.prisma.match.update({
      where: { id: matchId },
      data: { status: MatchStatus.FINISHED, endedAt: new Date() }
    });

    } catch (error) {
      console.error('❌ DB Save Error:', error);
    }
  }

  /** userId からそのプレイヤーが参加中のゲームIDを逆引きする */
  findGameByUserId(userId: string): string | null {
    for (const [gameId, ids] of this.playerIds.entries()) {
      if (ids.p1 === userId || ids.p2 === userId) {
        return gameId;
      }
    }
    return null;
  }

  /** 対戦相手の userId を返す */
  getOpponentId(gameId: string, myUserId: string): string | null {
    const ids = this.playerIds.get(gameId);
    if (!ids) return null;
    return ids.p1 === myUserId ? ids.p2 : ids.p1;
  }

  // game.service.ts 内に追加
  async getRecentFinishedMatch(userId: string) {
    return await this.prisma.match.findFirst({
      where: {
        players: { some: { userId } },
        status: 'FINISHED',
        // 終了してから30秒以内などの制限をつけると安全
        endedAt: { gte: new Date(Date.now() - 30 * 1000) } 
      },
      orderBy: { endedAt: 'desc' },
      include: { players: true }
    });
  }

  /** 切断等によるゲーム放棄処理: スコア保存 + ループ停止 + DB を FINISHED に更新 */
  async abandonGame(gameId: string, disconnectedUserId: string): Promise<void> {
    // メモリからスコア・プレイヤー情報を削除前に取得
    const state = this.games.get(gameId);
    const ids = this.playerIds.get(gameId);

    if (state && ids) {
      // 切断したプレイヤーを敗者、残ったプレイヤーを勝者として結果を保存
      const winnerId = ids.p1 === disconnectedUserId ? ids.p2 : ids.p1;
      const loserId = disconnectedUserId;
      const winnerSide: 'p1' | 'p2' = ids.p1 === winnerId ? 'p1' : 'p2';
      const loserSide: 'p1' | 'p2' = winnerSide === 'p1' ? 'p2' : 'p1';

      console.log(`🏆 Forfeit - Winner: ${winnerId}, Loser(disconnected): ${loserId}`);
      console.log(`   Score at disconnect - P1: ${state.score.p1}, P2: ${state.score.p2}`);

      try {
        await this.prisma.matchPlayer.upsert({
          where: { matchId_userId: { matchId: gameId, userId: winnerId } },
          update: { score: state.score[winnerSide], isWinner: true },
          create: { matchId: gameId, userId: winnerId, score: state.score[winnerSide], isWinner: true },
        });

        await this.prisma.matchPlayer.upsert({
          where: { matchId_userId: { matchId: gameId, userId: loserId } },
          update: { score: state.score[loserSide], isWinner: false },
          create: { matchId: gameId, userId: loserId, score: state.score[loserSide], isWinner: false },
        });

        await this.prisma.user.update({
          where: { id: winnerId },
          data: { wins: { increment: 1 }, rating: { increment: 20 } },
        });
        await this.prisma.user.update({
          where: { id: loserId },
          data: { losses: { increment: 1 }, rating: { decrement: 10 } },
        });

        await this.prisma.match.update({
          where: { id: gameId },
          data: { status: MatchStatus.FINISHED, endedAt: new Date() },
        });
        this.io?.to(gameId).emit('matchForfeit', {
          winnerId,
          loserId,
          status: 'forfeit',
          score: state.score
        });

        console.log(`✅ Match ${gameId} finalized as FINISHED (forfeit)`);
      } catch (error) {
        console.error(`⚠️ Failed to save forfeit result for match ${gameId}:`, error);
      }
    } else {
      // メモリにゲーム状態がない場合はステータスのみ更新
      try {
        await this.prisma.match.update({
          where: { id: gameId },
          data: { status: MatchStatus.ABANDONED, endedAt: new Date() },
        });
        console.log(`🚫 Match ${gameId} marked as ABANDONED (no game state)`);
      } catch (error) {
        console.error(`⚠️ Failed to mark match ${gameId} as ABANDONED:`, error);
      }
    }
    this.removeGame(gameId);
  }

  removeGame(gameId: string) {
    const interval = this.intervals.get(gameId);
    if (interval) clearInterval(interval);

    this.games.delete(gameId);
    this.gameInputs.delete(gameId);
    this.playerIds.delete(gameId);
    this.intervals.delete(gameId);
  }

  getLiveGames() {
    return Array.from(this.games.entries()).map(([gameId, state]) => ({
      gameId,
      status: state.status,
      score: state.score,
      mode: state.mode
    }));
  }


  getGameState(gameId: string): GameState | null {
    return this.games.get(gameId) || null;
  }

  getPlayerSide(gameId: string, userId: string): 'p1' | 'p2' | null {
    const ids = this.playerIds.get(gameId);
    if (!ids) return null;
    if (ids.p1 === userId) return 'p1';
    if (ids.p2 === userId) return 'p2';
    return null;
  }

  getPlayerIds(gameId: string): { p1: string, p2: string } | null {
    return this.playerIds.get(gameId) || null;
  }
}