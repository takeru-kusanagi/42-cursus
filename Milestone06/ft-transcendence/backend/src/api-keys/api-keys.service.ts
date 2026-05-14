import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * APIキーを生成する。
   * 平文キーは生成時にのみ返却し、DBにはSHA-256ハッシュを保存する。
   */
  private static readonly VALID_SCOPES = ['read', 'write', 'delete'];
  private static readonly MAX_KEYS_PER_USER = 10;

  async create(userId: string, name: string, scopes: string[] = ['read'], expiresAt?: string) {
    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.length > 64) {
      throw new BadRequestException('Name must be between 1 and 64 characters');
    }
    if (scopes && !scopes.every((s) => ApiKeysService.VALID_SCOPES.includes(s))) {
      throw new BadRequestException(`Invalid scopes. Allowed: ${ApiKeysService.VALID_SCOPES.join(', ')}`);
    }
    if (expiresAt && isNaN(Date.parse(expiresAt))) {
      throw new BadRequestException('Invalid expiresAt date');
    }
    const count = await this.prisma.apiKey.count({ where: { userId, revoked: false } });
    if (count >= ApiKeysService.MAX_KEYS_PER_USER) {
      throw new BadRequestException(`Maximum ${ApiKeysService.MAX_KEYS_PER_USER} active API keys allowed`);
    }
    // ft_ プレフィックス + 32バイトのランダム文字列
    const rawKey = `ft_${crypto.randomBytes(32).toString('hex')}`;
    const prefix = rawKey.slice(0, 10);
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const apiKey = await this.prisma.apiKey.create({
      data: {
        name,
        prefix,
        keyHash,
        scopes,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        userId,
      },
      select: {
        id: true,
        name: true,
        prefix: true,
        scopes: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    // 平文キーは今回限り返却
    return { ...apiKey, key: rawKey };
  }

  /** 指定ユーザーの全APIキーを取得（平文キーは含まない） */
  async findAllByUser(userId: string) {
    return this.prisma.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        prefix: true,
        scopes: true,
        expiresAt: true,
        lastUsedAt: true,
        revoked: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** APIキーを失効させる */
  async revoke(userId: string, keyId: string) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: { id: keyId, userId },
    });
    if (!apiKey) throw new NotFoundException('API key not found');

    await this.prisma.apiKey.update({
      where: { id: keyId },
      data: { revoked: true },
    });
    return { message: 'API key revoked' };
  }

  /**
   * X-API-Key ヘッダーの値を検証する。
   * 有効なキーなら所有ユーザーとスコープを返す。
   */
  async validateKey(rawKey: string) {
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const apiKey = await this.prisma.apiKey.findUnique({
      where: { keyHash },
      include: { user: { select: { id: true, username: true, name: true } } },
    });

    if (!apiKey) return null;
    if (apiKey.revoked) return null;
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null;

    // lastUsedAt を非同期で更新（レスポンスをブロックしない）
    this.prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    }).catch(() => {});

    return {
      user: apiKey.user,
      scopes: apiKey.scopes,
    };
  }
}
