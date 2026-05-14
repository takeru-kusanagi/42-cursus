import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

@Injectable()
export class AdminService {
  private adminTokens = new Map<string, number>();

  constructor(private readonly prisma: PrismaService) {}

  login(username: string, password: string): { token: string; expiresIn: number } {
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      throw new UnauthorizedException('Invalid admin credentials');
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + TOKEN_EXPIRY_MS;
    this.adminTokens.set(token, expiresAt);
    return { token, expiresIn: TOKEN_EXPIRY_MS / 1000 };
  }

  validateToken(token: string): boolean {
    const expiresAt = this.adminTokens.get(token);
    if (!expiresAt || Date.now() > expiresAt) {
      if (expiresAt) this.adminTokens.delete(token);
      return false;
    }
    return true;
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        provider: true,
        providerId: true,
        emailVerified: true,
        twoFactorEnabled: true,
        createdAt: true,
      },
    });

    return users.map((u) => ({
      id: u.id,
      username: u.username,
      name: u.name,
      email: u.email ?? '-',
      provider: u.provider,
      providerId: u.providerId ?? '-',
      emailVerified: u.emailVerified,
      twoFactorEnabled: u.twoFactorEnabled,
      createdAt: u.createdAt,
    }));
  }

  async clearEmailVerification(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { provider: true },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.provider !== 'local') {
      throw new BadRequestException('Only local accounts can clear email verification');
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: false,
        emailVerifyToken: null,
        emailVerifyExpires: null,
      },
    });
  }
}
