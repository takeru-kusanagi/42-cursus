import { Injectable, NotFoundException, BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ExportService } from '../auth/export.service';
import type { BulkOperation, BulkResult, BulkResponse } from './dto/bulk-operation.dto';

/** アクション → 必要スコープのマッピング */
const ACTION_SCOPES: Record<string, string> = {
  getUsers: 'read',
  getUser: 'read',
  getGames: 'read',
  getGame: 'read',
  getFriends: 'read',
  getRankings: 'read',
  exportData: 'read',
  sendFriendRequest: 'write',
  acceptFriendRequest: 'write',
  removeFriend: 'delete',
  deleteGames: 'delete',
};

@Injectable()
export class PublicApiService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly exportService: ExportService,
  ) {}

  /** ユーザー一覧（ページネーション付き） */
  async getUsers(page = 1, limit = 20) {
    if (limit > 100) limit = 100;
    if (page < 1) page = 1;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          name: true,
          avatar: true,
          wins: true,
          losses: true,
          rating: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  /** ユーザー詳細（公開プロフィール＋戦績） */
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        wins: true,
        losses: true,
        rating: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** 試合一覧（フィルタ・ページネーション） */
  async getGames(page = 1, limit = 20, userId?: string, status?: string) {
    if (limit > 100) limit = 100;
    if (page < 1) page = 1;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (userId) {
      where.OR = [{ player1Id: userId }, { player2Id: userId }];
    }
    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.game.findMany({
        skip,
        take: limit,
        where,
        select: {
          id: true,
          player1Id: true,
          player2Id: true,
          player1: { select: { id: true, username: true, name: true } },
          player2: { select: { id: true, username: true, name: true } },
          player1Score: true,
          player2Score: true,
          winnerId: true,
          winner: { select: { id: true, username: true, name: true } },
          duration: true,
          isRanked: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.game.count({ where }),
    ]);

    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  /** 試合詳細 */
  async getGameById(id: string) {
    const game = await this.prisma.game.findUnique({
      where: { id },
      select: {
        id: true,
        player1Id: true,
        player2Id: true,
        player1: { select: { id: true, username: true, name: true } },
        player2: { select: { id: true, username: true, name: true } },
        player1Score: true,
        player2Score: true,
        winnerId: true,
        winner: { select: { id: true, username: true, name: true } },
        duration: true,
        isRanked: true,
        status: true,
        createdAt: true,
      },
    });
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  /** フレンドリクエスト送信 */
  async sendFriendRequest(requesterId: string, addresseeId: string) {
    if (requesterId === addresseeId) {
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    const addressee = await this.prisma.user.findUnique({
      where: { id: addresseeId },
      select: { id: true },
    });
    if (!addressee) throw new NotFoundException('User not found');

    const existing = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId },
        ],
      },
    });
    if (existing) throw new ConflictException('Friend request already exists for this pair');

    try {
      return await this.prisma.friendship.create({
        data: { requesterId, addresseeId, status: 'PENDING' },
        select: {
          id: true,
          requesterId: true,
          addresseeId: true,
          status: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Friend request already exists for this pair');
      }
      throw error;
    }
  }

  /** フレンド申請の承認 */
  async acceptFriendRequest(currentUserId: string, requesterId: string) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        requesterId,
        addresseeId: currentUserId,
      },
    });

    if (!friendship) throw new NotFoundException('Friend request not found');
    if (friendship.status !== 'PENDING') {
      throw new ConflictException('Only pending requests can be accepted');
    }

    return this.prisma.friendship.update({
      where: { id: friendship.id },
      data: { status: 'ACCEPTED' },
      select: {
        id: true,
        requesterId: true,
        addresseeId: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  /** APIキー所有者のフレンドリスト取得 */
  async getFriends(userId: string) {
    const rows = await this.prisma.friendship.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: { select: { id: true, username: true, name: true, avatar: true } },
        addressee: { select: { id: true, username: true, name: true, avatar: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return rows.map((row) => {
      const friend = row.requesterId === userId ? row.addressee : row.requester;
      return {
        id: friend.id,
        username: friend.username,
        name: friend.name,
        avatar: friend.avatar,
      };
    });
  }

  /** フレンド解除 */
  async removeFriend(currentUserId: string, otherUserId: string) {
    if (currentUserId === otherUserId) {
      throw new BadRequestException('Cannot remove yourself');
    }

    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: currentUserId, addresseeId: otherUserId },
          { requesterId: otherUserId, addresseeId: currentUserId },
        ],
      },
      select: { id: true },
    });

    if (!friendship) throw new NotFoundException('Friendship not found');

    await this.prisma.friendship.delete({ where: { id: friendship.id } });
    return { message: 'Friend removed' };
  }

  /** ランキング（rating順） */
  async getRankings(limit = 20) {
    if (limit > 100) limit = 100;
    return this.prisma.user.findMany({
      take: limit,
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        wins: true,
        losses: true,
        rating: true,
      },
      orderBy: { rating: 'desc' },
    });
  }

  // ─── Bulk Operations ──────────────────────

  /** バルク操作を順次実行し、操作ごとの結果を返す */
  async executeBulk(
    operations: BulkOperation[],
    userId: string,
    scopes: string[],
  ): Promise<BulkResponse> {
    if (!Array.isArray(operations)) {
      throw new BadRequestException('operations must be an array');
    }
    if (operations.length === 0) {
      throw new BadRequestException('operations must not be empty');
    }
    if (operations.length > 10) {
      throw new BadRequestException('Maximum 10 operations per bulk request');
    }

    const results: BulkResult[] = [];

    for (const op of operations) {
      const action = op.action;

      // 未知のアクション
      const requiredScope = ACTION_SCOPES[action];
      if (!requiredScope) {
        results.push({ action, success: false, error: `Unknown action: ${action}` });
        continue;
      }

      // スコープ検証
      if (!scopes.includes(requiredScope)) {
        results.push({
          action,
          success: false,
          error: `Insufficient scope. Required: ${requiredScope}`,
        });
        continue;
      }

      try {
        const data = await this.dispatchAction(action, op.params ?? {}, userId);
        results.push({ action, success: true, data });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Internal error';
        results.push({ action, success: false, error: message });
      }
    }

    return { results };
  }

  /** アクション名を既存メソッドにルーティング */
  private async dispatchAction(
    action: string,
    params: Record<string, unknown>,
    userId: string,
  ): Promise<unknown> {
    switch (action) {
      case 'getUsers':
        return this.getUsers(
          params.page as number | undefined,
          params.limit as number | undefined,
        );
      case 'getUser':
        return this.getUserById(params.id as string);
      case 'getGames':
        return this.getGames(
          params.page as number | undefined,
          params.limit as number | undefined,
          params.userId as string | undefined,
          params.status as string | undefined,
        );
      case 'getGame':
        return this.getGameById(params.id as string);
      case 'getFriends':
        return this.getFriends(userId);
      case 'getRankings':
        return this.getRankings(params.limit as number | undefined);
      case 'exportData':
        return this.exportService.getExportData(userId);
      case 'sendFriendRequest':
        return this.sendFriendRequest(userId, params.userId as string);
      case 'acceptFriendRequest':
        return this.acceptFriendRequest(userId, params.userId as string);
      case 'removeFriend':
        return this.removeFriend(userId, params.userId as string);
      case 'deleteGames':
        return this.deleteGames(userId, params.gameIds as string[]);
      default:
        throw new BadRequestException(`Unknown action: ${action}`);
    }
  }

  /** ユーザーの試合を一括削除（最大50件） */
  async deleteGames(userId: string, gameIds: string[]) {
    if (!Array.isArray(gameIds) || gameIds.length === 0) {
      throw new BadRequestException('gameIds must be a non-empty array');
    }
    if (gameIds.length > 50) {
      throw new BadRequestException('Maximum 50 games per delete operation');
    }

    // 自分が参加している試合のみ削除可能
    const games = await this.prisma.game.findMany({
      where: {
        id: { in: gameIds },
        OR: [{ player1Id: userId }, { player2Id: userId }],
      },
      select: { id: true },
    });

    const validIds = games.map((g) => g.id);
    if (validIds.length === 0) {
      throw new NotFoundException('No matching games found for this user');
    }

    const { count } = await this.prisma.game.deleteMany({
      where: { id: { in: validIds } },
    });

    return { deleted: count };
  }
}
