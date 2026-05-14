import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from '../pong/game.service';
import type { GameState, InputState, GameMode } from '@shared/pong/types';
import { PrismaService } from '../prisma/prisma.service';
import { MatchMode, MatchStatus } from '@prisma/client';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/' })
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  
  private userSocketMap = new Map<string, string>(); 
  private pendingMatches = new Map<string, Set<string>>(); 
  private waitingPlayer: Socket | null = null;
  private disconnectTimeouts = new Map<string, NodeJS.Timeout>();

  constructor(
    private gameService: GameService,
    private prisma: PrismaService 
  ) {}

  afterInit(server: Server) {
    this.gameService.io = server;
  }

  // events.gateway.ts の handleConnection

  async handleConnection(client: Socket) {
      const userId = client.handshake.query.userId as string;
      if (!userId || userId === 'undefined' || userId === 'null') return;

      this.userSocketMap.set(userId, client.id);
      client.data.userId = userId;

      // 進行中のゲームがあれば部屋に戻す
      const gameId = this.gameService.findGameByUserId(userId);
      if (gameId) {
        client.join(gameId); // Roomに再入室
        
        const timeout = this.disconnectTimeouts.get(userId);
        if (timeout) {
          clearTimeout(timeout);
          this.disconnectTimeouts.delete(userId);

          const opponentId = this.gameService.getOpponentId(gameId, userId);
          // 【修正点】opponentId が string であることを確認してから Map を引く
          if (opponentId) {
            const opponentSocketId = this.userSocketMap.get(opponentId);
            if (opponentSocketId) {
              this.getSocketSafely(opponentSocketId)?.emit('opponentReconnected');
            }
          }
        }

        const currentState = this.gameService.getGameState(gameId);
        const side = this.gameService.getPlayerSide(gameId, userId);
        client.emit('matchFound', { gameId, side, state: currentState });
      }else {
        // ✅ 2. 進行中のゲームがない場合、直近の終了した試合を確認
        // gameService に getRecentFinishedMatch を実装しておく必要があります
        try {
          const lastMatch = await this.gameService.getRecentFinishedMatch(userId);
          if (lastMatch) {
            const myResult = lastMatch.players.find(p => p.userId === userId);
            
            // 自分が負け（isWinner === false）かつ、終了理由が forfeit の場合
            if (myResult && !myResult.isWinner) {
              const opponent = lastMatch.players.find(p => p.userId !== userId);
              
              client.emit('matchForfeit', {
                winnerId: opponent?.userId,
                loserId: userId,
                status: 'forfeit',
                score: {
                  p1: lastMatch.players[0].score,
                  p2: lastMatch.players[1].score
                }
              });
            }
          }
        } catch (e) {
          console.error("Failed to check last match status:", e);
        }
      }
      console.log(`✅ User registered: ${userId}`);
    }

  async handleDisconnect(client: Socket) {
    const userId = client.data.userId as string | undefined;

    // 1. userSocketMap からの削除
    if (userId) {
      this.userSocketMap.delete(userId);
      console.log(`❌ User disconnected: ${userId}`);
    } else {
      // userId が不明な場合はソケットIDで逆引き
      for (const [uid, socketId] of this.userSocketMap.entries()) {
        if (socketId === client.id) {
          this.userSocketMap.delete(uid);
          break;
        }
      }
    }

    // 2. キュー待機中だった場合のクリーンアップ
    if (this.waitingPlayer?.id === client.id) {
      this.waitingPlayer = null;
      console.log(`🧹 Removed disconnected player from queue`);
    }

    // 3. pendingMatches (フレンドマッチ待機) からの削除
    for (const [matchId, participants] of this.pendingMatches.entries()) {
      if (userId && participants.has(userId)) {
        participants.delete(userId);
        if (participants.size === 0) {
          this.pendingMatches.delete(matchId);
        }
        console.log(`🧹 Removed ${userId} from pending match ${matchId}`);
      }
    }

    // 4. アクティブなゲームの停止 + 相手への通知
    if (userId) {
      const gameId = this.gameService.findGameByUserId(userId);
      if (gameId) {
        console.log(`⏳ Starting 5s grace period for ${userId} in game ${gameId}`);
        const opponentId = this.gameService.getOpponentId(gameId, userId);

        if (opponentId) {
          const opponentSocketId = this.userSocketMap.get(opponentId);
          this.getSocketSafely(opponentSocketId)?.emit('opponentDisconnected', { gameId });
        }

        const existingTimeout = this.disconnectTimeouts.get(userId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }

        // 5秒間の猶予タイマー
        const timeout = setTimeout(async () => {
          console.log(`⏰ Time's up for ${userId}. Forfeiting game ${gameId}`);

        // ゲームループ停止 + スコア保存 + DB を FINISHED に更新
        await this.gameService.abandonGame(gameId, userId);

        // 残っている相手プレイヤーに通知
        if (opponentId) {
            const opponentSocketId = this.userSocketMap.get(opponentId);
            this.getSocketSafely(opponentSocketId)?.emit('matchForfeit', { winnerId: opponentId });
          }
          this.disconnectTimeouts.delete(userId);
        }, 5000);
        console.log(`🛑 Game ${gameId} stopped due to disconnect by ${userId}`);
        this.disconnectTimeouts.set(userId, timeout);
      }
    }
  }

  // backend/src/events/events.gateway.ts

  @SubscribeMessage('reconnectToMatch')
  async handleReconnectToMatch(client: Socket, data: { gameId: string, userId: string }) {
    const { gameId, userId } = data;
    
    // 1. メモリ（GameService）のデータを確認
    const state = this.gameService.getGameState(gameId);
    const side = this.gameService.getPlayerSide(gameId, userId);
    const ids = this.gameService.getPlayerIds(gameId); // さっき追加したメソッド

    // 試合がまだ進行中の場合
    if (state && side && ids) {
      client.join(gameId);
      return client.emit('matchFound', { 
        gameId, 
        side, 
        state, 
        playerIds: ids 
      });
    }

    // 2. メモリにない場合、DB をチェック（共倒れ防止のキモ）
    try {
      const match = await this.prisma.match.findUnique({
        where: { id: gameId }
      });

      if (match && (match.status === MatchStatus.FINISHED || match.status === MatchStatus.ABANDONED)) {
        console.log(`🏁 Match ${gameId} is already ${match.status}. Sending matchNotFound.`);

        // ★ ここが重要！フロントエンドに「お掃除してメニューに戻れ」と指示する
        return client.emit('matchNotFound');
      }
    } catch (error) {
      console.error("DB check error during reconnect:", error);
    }

    // 3. 試合中のはずなのにデータがなく、DBも終了していない場合のみ「敗北」とする
    console.log(`❌ Match data not found for ${gameId}. Sending forfeit.`);
    client.emit('matchForfeit', { winnerId: 'OPPONENT' });
  }

  @SubscribeMessage('inviteFriend')
  handleInviteFriend(
    @ConnectedSocket() client: Socket, 
    @MessageBody() data: { matchId: string; opponentId: string }
  ) {
    const { matchId, opponentId } = data;
    const myUserId = client.handshake.query.userId as string;

    console.log(`--- Invite Step --- Match: ${matchId}`);
    
    // 1. 自分の準備状況を記録
    if (!this.pendingMatches.has(matchId)) {
      this.pendingMatches.set(matchId, new Set());
    }
    const readyUsers = this.pendingMatches.get(matchId)!;
    readyUsers.add(myUserId);

    // 2. 相手も準備できているかチェック
    if (readyUsers.has(opponentId)) {
      console.log(`🚀 BOTH READY! Starting Match: ${matchId}`);
      this.startMatchSynchronized(matchId, Array.from(readyUsers)[0], Array.from(readyUsers)[1]);
      this.pendingMatches.delete(matchId); // 完了したので削除
      return;
    }

    // 3. まだ片方だけなら、相手に「招待（通知）」を飛ばす
    const opponentSocketId = this.userSocketMap.get(opponentId);
    if (opponentSocketId) {
      const opponentSocket = this.getSocketSafely(opponentSocketId);
      if (opponentSocket) {
        // 相手に「〇〇さんが開始ボタンを押したよ」と教える
        opponentSocket.emit('opponentReady', { from: myUserId, matchId });
        console.log(`Sent notification to ${opponentId}`);
      }
    }
  }

  // 内部用：同期して試合を開始する
  private startMatchSynchronized(gameId: string, p1Id: string, p2Id: string) {
  const p1Socket = this.getSocketSafely(this.userSocketMap.get(p1Id));
  const p2Socket = this.getSocketSafely(this.userSocketMap.get(p2Id));

  if (!p1Socket || !p2Socket) return;

  p1Socket.join(gameId);
  p2Socket.join(gameId);

  const state = this.gameService.createGameForMatch(gameId, p1Id, p2Id);

  // ★ playerIds も一緒に送る！
  const playerIds = { p1: p1Id, p2: p2Id };

  p1Socket.emit('matchFound', { 
    gameId, 
    side: 'p1', 
    state, 
    playerIds // 追加
  });
  
  p2Socket.emit('matchFound', { 
    gameId, 
    side: 'p2', 
    state, 
    playerIds // 追加
  });
}

  // 内部用：最強のソケット取得ロジック（共通化）
  private getSocketSafely(socketId: string | undefined): any {
    if (!socketId) return null;
    const s = this.server as any;
    try {
      return s.sockets?.get?.(socketId) || 
             s.sockets?.sockets?.get?.(socketId) ||
             s.of?.('/').sockets?.get?.(socketId);
    } catch { return null; }
  }

  /* --- 以下、既存の Queue などの処理 --- */
  @SubscribeMessage('joinQueue')
    async handleJoinQueue(@ConnectedSocket() client: Socket, @MessageBody() data: { mode: GameMode }) {
      // 自分自身がすでに待機中の場合は無視
      if (this.waitingPlayer?.id === client.id) return;

      if (this.waitingPlayer) {
        try {
          const p1Id = this.waitingPlayer.data.userId;
          const p2Id = client.data.userId;

          // ★ 修正3: DBに記帳してから試合を開始
          const match = await this.prisma.match.create({
            data: {
              mode: MatchMode.ONLINE_MULTIPLAYER,
              status: MatchStatus.IN_PROGRESS,
              players: {
                create: [
                  { userId: p1Id, score: 0 },
                  { userId: p2Id, score: 0 }
                ]
              }
            }
          });

          const gameId = match.id; // DBのIDをゲームIDとして使用
          
          // 準備
          this.waitingPlayer.join(gameId);
          client.join(gameId);

          // ゲームエンジンの初期化
          const state = this.gameService.createGameForMatch(gameId, p1Id, p2Id);

          // フロントエンドへ通知（gameId は DB の CUID）
          this.waitingPlayer.emit('matchFound', { gameId, side: 'p1', state });
          client.emit('matchFound', { gameId, side: 'p2', state });
          
          console.log(`🚀 Match Created in DB & Started: ${gameId}`);
          this.waitingPlayer = null;
        } catch (error) {
          console.error('❌ Failed to create match in DB:', error);
          client.emit('error', 'マッチングの作成に失敗しました');
        }
      } else {
        this.waitingPlayer = client;
        client.emit('waitingInQueue');
      }
    }

  @SubscribeMessage('input')
  handleInput(@MessageBody() { gameId, input, side }: { gameId: string; input: InputState; side: 'p1' | 'p2' }) {
    this.gameService.applyInput(gameId, input, side);
  }

  @SubscribeMessage('requestLiveGames')
  handleRequestLiveGames() { return this.gameService.getLiveGames(); }

  private broadcastLiveGames() {
    const games = this.gameService.getLiveGames();
    this.server.emit('liveGamesUpdate', games);
  }
}