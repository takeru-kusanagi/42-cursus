import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatsPresenceService } from '../chats/chats.presence.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatsPresenceService: ChatsPresenceService,
  ) {}

  async search(currentUserId: string, rawQuery: string) {
    const query = rawQuery.trim();
    if (!query) return [];
    if (query.length > 20) {
      throw new BadRequestException('Search query must be 20 characters or fewer');
    }

    const users = await this.prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
      },
      orderBy: { username: 'asc' },
      take: 20,
    });

    return users.map((user) => ({
      id: user.id,
      username: user.username,
      displayName: user.name,
      avatar: user.avatar,
    }));
  }

  /** Base64 Data URI の最大サイズ (約5MB) */
  private static readonly MAX_AVATAR_SIZE = 5 * 1024 * 1024;

  async updateAvatar(userId: string, avatar: string) {
    if (!avatar || typeof avatar !== 'string') {
      throw new BadRequestException('avatar is required');
    }

    if (!avatar.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,/)) {
      throw new BadRequestException(
        'Invalid avatar format. Must be a Base64 Data URI (e.g. data:image/png;base64,...)',
      );
    }

    if (avatar.length > UsersService.MAX_AVATAR_SIZE) {
      throw new BadRequestException('Avatar is too large. Maximum size is approximately 5MB.');
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
      },
    });

    return {
      id: user.id,
      username: user.username,
      displayName: user.name,
      avatar: user.avatar,
    };
  }

  async getProfile(viewerId: string, targetUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: viewerId, addresseeId: targetUserId },
          { requesterId: targetUserId, addresseeId: viewerId },
        ],
      },
      select: {
        id: true,
        requesterId: true,
        addresseeId: true,
        status: true,
      },
    });

    return {
      id: user.id,
      username: user.username,
      displayName: user.name,
      avatar: user.avatar,
      isActive: this.chatsPresenceService.isActive(user.id),
      friendship,
    };
  }
}
