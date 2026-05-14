import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  MatchMode,
  MatchStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type FinalizePlayerInput = {
  userId: string;
  score: number;
  isWinner: boolean;
};

type StartMatchResult = {
  matchId: string;
  mode: MatchMode;
  status: MatchStatus;
  startedAt: Date;
};

type FinalizeMatchResult = {
  matchId: string;
  status: MatchStatus;
  endedAt: Date | null;
  alreadyFinalized: boolean;
  players: Array<{
    id: string;
    matchId: string;
    userId: string;
    score: number;
    isWinner: boolean;
  }>;
};

type Achievement = {
  code: 'FIRST_WIN' | 'TEN_WINS' | 'HUNDRED_WINS';
  unlocked: boolean;
};

type ProgressionSummary = {
  level: number;
  currentMatches: number;
  requiredMatches: number;
  progressPercent: number;
};

type StatsSummary = {
  wins: number;
  losses: number;
  total: number;
  winRate: number;
  progression: ProgressionSummary;
  achievements: Achievement[];
};

type MatchHistoryItem = {
  matchId: string;
  mode: MatchMode;
  status: MatchStatus;
  endedAt: Date | null;
  score: number;
  opponentScore: number | null;
  isWinner: boolean;
  opponent: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  } | null;
};

type MatchHistoryResponse = {
  items: MatchHistoryItem[];
  nextCursor: string | null;
};

type LeaderboardItem = StatsSummary & {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

type SummaryEntry = {
  isWinner: boolean;
  status: MatchStatus;
  matchHasWinner: boolean;
};

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  /**
   * 1. マッチ開始時 (EventsGatewayなどから呼ばれる)
   */
  async startMatch(userId: string, mode: string): Promise<StartMatchResult> {
    await this.assertUsersExist([userId]);
    const parsedMode = this.parseMode(mode); 
    
    const match = await this.prisma.match.create({
      data: {
        mode: parsedMode,
        status: MatchStatus.IN_PROGRESS,
        players: {
          create: [{ userId: userId }]
        }
      },
      select: {
        id: true,
        mode: true,
        status: true,
        startedAt: true,
      },
    });

    return {
      matchId: match.id,
      mode: match.mode,
      status: match.status,
      startedAt: match.startedAt,
    };
  }

  /**
   * 2. スコアと勝敗を確定させる (最新の修正版)
   */
  async finalizeMatch(
    currentUserId: string,
    matchId: string,
    players: FinalizePlayerInput[],
    rawStatus?: string,
    rawEndedAt?: string,
  ): Promise<FinalizeMatchResult> {
    this.validatePlayers(currentUserId, players);
    await this.assertUsersExist(players.map((player) => player.userId));

    const status = this.parseStatus(rawStatus);
    const endedAt = this.parseEndedAt(rawEndedAt);

    return this.prisma.$transaction(async (tx) => {
      // 1. マッチを取得
      const match = await tx.match.findUnique({
        where: { id: matchId },
      });

      if (!match) throw new NotFoundException('Match not found');

      // 2. マッチ本体を強制更新 (ステータスを FINISHED に)
      await tx.match.update({
        where: { id: matchId },
        data: { 
          status: status, 
          endedAt: endedAt 
        },
      });

      // 3. 各プレイヤーのスコアを upsert (あれば更新、なければ作成)
      for (const p of players) {
        await tx.matchPlayer.upsert({
          where: {
            matchId_userId: { matchId: matchId, userId: p.userId }
          },
          update: {
            score: p.score,
            isWinner: p.isWinner
          },
          create: {
            matchId: matchId,
            userId: p.userId,
            score: p.score,
            isWinner: p.isWinner
          }
        });

        // 4. ユーザーの勝敗数をインクリメント
        // ※ すでに終了したマッチに対して2回リクエストが来た場合に備え、
        // 最初の1回（match.statusがIN_PROGRESSだった時）だけインクリメントするのが安全ですが、
        // まずは反映を優先させるため、このまま実行します。
        if (match.status === MatchStatus.IN_PROGRESS) {
          await tx.user.update({
            where: { id: p.userId },
            data: {
              wins: p.isWinner ? { increment: 1 } : undefined,
              losses: !p.isWinner ? { increment: 1 } : undefined,
            }
          });
        }
      }

      // 5. 最終的な結果をDBから再取得して返す
      const finalizedPlayers = await tx.matchPlayer.findMany({
        where: { matchId },
        orderBy: { score: 'desc' },
      });

      return {
        matchId,
        status: status,
        endedAt: endedAt,
        alreadyFinalized: match.status !== MatchStatus.IN_PROGRESS,
        players: finalizedPlayers,
      };
    });
  }

  // --- プライベート・バリデーション・ヘルパー ---

  private parseMode(rawMode: string): MatchMode {
    if (!rawMode) throw new BadRequestException('Match mode is required');
    const mode = rawMode.trim().toUpperCase() as MatchMode;
    if (!Object.values(MatchMode).includes(mode)) {
      throw new BadRequestException('Invalid match mode');
    }
    return mode;
  }

  private parseStatus(rawStatus?: string): MatchStatus {
    if (!rawStatus) return MatchStatus.FINISHED;
    const status = rawStatus.trim().toUpperCase() as MatchStatus;
    if (status !== MatchStatus.FINISHED && status !== MatchStatus.ABANDONED) {
      throw new BadRequestException('Invalid finalize status');
    }
    return status;
  }

  private parseEndedAt(rawEndedAt?: string): Date {
    if (!rawEndedAt) return new Date();
    const endedAt = new Date(rawEndedAt);
    if (Number.isNaN(endedAt.getTime())) {
      throw new BadRequestException('Invalid endedAt');
    }
    return endedAt;
  }

  private validatePlayers(currentUserId: string, players: FinalizePlayerInput[]) {
    if (!Array.isArray(players) || players.length !== 2) {
      throw new BadRequestException('Exactly two players are required');
    }
    const userIds = new Set<string>();
    let winnerCount = 0;
    for (const player of players) {
      if (!player?.userId) throw new BadRequestException('Each player must have a userId');
      if (!Number.isInteger(player.score) || player.score < 0) {
        throw new BadRequestException('Player score must be a non-negative integer');
      }
      if (typeof player.isWinner !== 'boolean') {
        throw new BadRequestException('Each player must have an isWinner flag');
      }
      if (userIds.has(player.userId)) throw new BadRequestException('Duplicate players are not allowed');
      userIds.add(player.userId);
      if (player.isWinner) winnerCount += 1;
    }
    if (!userIds.has(currentUserId)) throw new BadRequestException('Current user must be included in the match');
    if (winnerCount > 1) throw new BadRequestException('Only one winner can be recorded');
  }

  private async assertUsersExist(userIds: string[]) {
    const existingUsers = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });
    if (existingUsers.length !== userIds.length) {
      throw new NotFoundException('One or more players were not found');
    }
  }

  // --- 統計・履歴取得系メソッド ---

  private buildSummary(entries: SummaryEntry[]): StatsSummary {
    const wins = entries.filter((entry) => entry.isWinner).length;
    const losses = entries.filter(
      (entry) => !entry.isWinner && (entry.status === MatchStatus.FINISHED || entry.matchHasWinner),
    ).length;
    const total = entries.length;
    return {
      wins, losses, total,
      winRate: total > 0 ? Math.round((wins / total) * 100) : 0,
      progression: this.buildProgression(total),
      achievements: this.buildAchievements(wins),
    };
  }

  private buildProgression(totalMatches: number): ProgressionSummary {
    let level = 1;
    let consumedMatches = 0;
    let requiredMatches = 2;
    while (level < 10 && totalMatches - consumedMatches >= requiredMatches) {
      consumedMatches += requiredMatches;
      level += 1;
      requiredMatches *= 2;
    }
    const currentMatches = totalMatches - consumedMatches;
    const progressPercent = Math.max(0, Math.min(100, Math.round((currentMatches / requiredMatches) * 100)));
    return { level, currentMatches, requiredMatches, progressPercent };
  }

  private buildAchievements(wins: number): Achievement[] {
    return [
      { code: 'FIRST_WIN', unlocked: wins >= 1 },
      { code: 'TEN_WINS', unlocked: wins >= 10 },
      { code: 'HUNDRED_WINS', unlocked: wins >= 100 },
    ];
  }

  async getMyStats(userId: string): Promise<StatsSummary> {
    const rows = await this.prisma.matchPlayer.findMany({
      where: { userId, match: { status: { in: [MatchStatus.FINISHED, MatchStatus.ABANDONED] } } },
      select: {
        isWinner: true,
        match: {
          select: {
            status: true,
            players: {
              select: { isWinner: true },
            },
          },
        },
      },
    });
    return this.buildSummary(rows.map((row) => ({
      isWinner: row.isWinner,
      status: row.match.status,
      matchHasWinner: row.match.players.some((player) => player.isWinner),
    })));
  }

  async getMyMatches(userId: string, cursor?: string, limitRaw?: string): Promise<MatchHistoryResponse> {
    const limit = limitRaw ? Math.min(50, Math.floor(Number(limitRaw))) : 20;
    const rows = await this.prisma.matchPlayer.findMany({
      where: { userId, match: { status: { in: [MatchStatus.FINISHED, MatchStatus.ABANDONED] } } },
      orderBy: [{ match: { endedAt: 'desc' } }],
      take: limit + 1,
      include: {
        match: {
          include: {
            players: { where: { userId: { not: userId } }, include: { user: true } }
          }
        }
      }
    });
    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    return {
      items: page.map(row => ({
        matchId: row.matchId, mode: row.match.mode, status: row.match.status, endedAt: row.match.endedAt,
        score: row.score, opponentScore: row.match.players[0]?.score ?? null, isWinner: row.isWinner,
        opponent: row.match.players[0] ? {
          id: row.match.players[0].user.id, username: row.match.players[0].user.username,
          displayName: row.match.players[0].user.name, avatar: row.match.players[0].user.avatar
        } : null
      })),
      nextCursor: hasMore ? page[page.length - 1].match.endedAt?.toISOString() ?? null : null
    };
  }

  async getLeaderboard(limitRaw?: string): Promise<LeaderboardItem[]> {
    const limit = limitRaw ? Math.min(50, Math.floor(Number(limitRaw))) : 10;
    const users = await this.prisma.user.findMany({
      include: {
        matchPlayers: {
          where: { match: { status: { in: [MatchStatus.FINISHED, MatchStatus.ABANDONED] } } },
          include: {
            match: {
              select: {
                status: true,
                players: {
                  select: { isWinner: true },
                },
              },
            },
          },
        },
      }
    });
    return users.map(u => ({
      userId: u.id, username: u.username, displayName: u.name, avatarUrl: u.avatar,
      ...this.buildSummary(u.matchPlayers.map((player) => ({
        isWinner: player.isWinner,
        status: player.match.status,
        matchHasWinner: player.match.players.some((entry) => entry.isWinner),
      })))
    })).sort((a, b) => b.wins - a.wins).slice(0, limit);
  }
}
