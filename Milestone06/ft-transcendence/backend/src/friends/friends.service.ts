import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FriendshipStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertUserExists(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  private normalizePair(user1Id: string, user2Id: string) {
    return user1Id < user2Id
      ? { userAId: user1Id, userBId: user2Id }
      : { userAId: user2Id, userBId: user1Id };
  }

  async request(requesterId: string, addresseeId: string) {
    if (requesterId === addresseeId) {
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    await this.assertUserExists(addresseeId);

    const existing = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId },
        ],
      },
    });

    if (existing) {
      throw new ConflictException('Friend request already exists for this pair');
    }

    try {
      return await this.prisma.friendship.create({
        data: {
          requesterId,
          addresseeId,
          status: FriendshipStatus.PENDING,
        },
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

  async accept(currentUserId: string, requesterId: string) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        requesterId,
        addresseeId: currentUserId,
      },
    });

    if (!friendship) {
      throw new NotFoundException('Friend request not found');
    }

    if (friendship.status !== FriendshipStatus.PENDING) {
      throw new ConflictException('Only pending requests can be accepted');
    }

    return this.prisma.friendship.update({
      where: { id: friendship.id },
      data: { status: FriendshipStatus.ACCEPTED },
      select: {
        id: true,
        requesterId: true,
        addresseeId: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async remove(currentUserId: string, otherUserId: string) {
    if (currentUserId === otherUserId) {
      throw new BadRequestException('Cannot delete yourself');
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

    if (!friendship) {
      return { deleted: false };
    }

    const { userAId, userBId } = this.normalizePair(currentUserId, otherUserId);

    await this.prisma.$transaction(async (tx) => {
      await tx.friendship.delete({ where: { id: friendship.id } });

      await tx.conversation.deleteMany({
        where: {
          OR: [
            { userAId, userBId },
            { userAId: otherUserId, userBId: currentUserId },
          ],
        },
      });
    });

    return { deleted: true };
  }

  async listFriends(userId: string) {
    const rows = await this.prisma.friendship.findMany({
      where: {
        status: FriendshipStatus.ACCEPTED,
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
        displayName: friend.name,
        avatar: friend.avatar,
      };
    });
  }

  async listIncomingRequests(userId: string) {
    const rows = await this.prisma.friendship.findMany({
      where: {
        addresseeId: userId,
        status: FriendshipStatus.PENDING,
      },
      include: {
        requester: { select: { id: true, username: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((row) => ({
      requestId: row.id,
      requesterId: row.requester.id,
      username: row.requester.username,
      displayName: row.requester.name,
      avatar: row.requester.avatar,
      createdAt: row.createdAt,
    }));
  }
}
