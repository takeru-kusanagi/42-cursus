import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type ChatMessageView = {
  id: string;
  conversationId: string;
  fromUserId: string;
  toUserId: string;
  text: string;
  createdAt: Date;
};

type ConversationPair = {
  id: string;
  userAId: string;
  userBId: string;
};

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

  private normalizePair(user1Id: string, user2Id: string): { userAId: string; userBId: string } {
    return user1Id < user2Id ? { userAId: user1Id, userBId: user2Id } : { userAId: user2Id, userBId: user1Id };
  }

  private async assertUserExists(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  private async assertAcceptedFriendship(userId: string, otherUserId: string) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        status: 'ACCEPTED',
        OR: [
          { requesterId: userId, addresseeId: otherUserId },
          { requesterId: otherUserId, addresseeId: userId },
        ],
      },
      select: { id: true },
    });

    if (!friendship) {
      throw new ForbiddenException('DM is only available between friends');
    }
  }

  private async findConversation(userAId: string, userBId: string) {
    return this.prisma.conversation.findUnique({
      where: { userAId_userBId: { userAId, userBId } },
      select: { id: true, userAId: true, userBId: true },
    });
  }

  private async getOrCreateConversation(userAId: string, userBId: string) {
    const existing = await this.findConversation(userAId, userBId);
    if (existing) {
      return existing;
    }

    try {
      return await this.prisma.conversation.create({
        data: { userAId, userBId },
        select: { id: true, userAId: true, userBId: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const raceWinner = await this.findConversation(userAId, userBId);
        if (raceWinner) {
          return raceWinner;
        }
      }
      throw error;
    }
  }

  private toMessageView(
    message: { id: string; senderId: string; body: string; createdAt: Date },
    conversation: ConversationPair,
    requesterId: string,
  ): ChatMessageView {
    const toUserId = requesterId === conversation.userAId ? conversation.userBId : conversation.userAId;
    return {
      id: message.id,
      conversationId: conversation.id,
      fromUserId: message.senderId,
      toUserId,
      text: message.body,
      createdAt: message.createdAt,
    };
  }

  async sendMessage(fromUserId: string, toUserId: string, rawText: string): Promise<ChatMessageView> {
    const text = rawText.trim();
    if (!toUserId) {
      throw new BadRequestException('toUserId is required');
    }
    if (fromUserId === toUserId) {
      throw new BadRequestException('Cannot send DM to yourself');
    }
    if (!text) {
      throw new BadRequestException('Message cannot be empty');
    }
    if (text.length > 1000) {
      throw new BadRequestException('Message is too long (max 1000 chars)');
    }

    await this.assertUserExists(toUserId);
    await this.assertAcceptedFriendship(fromUserId, toUserId);

    const { userAId, userBId } = this.normalizePair(fromUserId, toUserId);
    const conversation = await this.getOrCreateConversation(userAId, userBId);

    const message = await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: fromUserId,
        body: text,
      },
      select: {
        id: true,
        senderId: true,
        body: true,
        createdAt: true,
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: message.createdAt },
      select: { id: true },
    });

    return this.toMessageView(message, conversation, fromUserId);
  }

  async getMessages(currentUserId: string, otherUserId: string, cursor?: string, limitRaw?: string) {
    if (currentUserId === otherUserId) {
      throw new BadRequestException('Cannot open DM with yourself');
    }
    await this.assertUserExists(otherUserId);
    await this.assertAcceptedFriendship(currentUserId, otherUserId);

    const { userAId, userBId } = this.normalizePair(currentUserId, otherUserId);
    const conversation = await this.prisma.conversation.findUnique({
      where: { userAId_userBId: { userAId, userBId } },
      select: { id: true, userAId: true, userBId: true },
    });

    if (!conversation) {
      return { conversationId: null, messages: [], nextCursor: null };
    }

    const parsed = limitRaw ? Number(limitRaw) : 30;
    const limit = Number.isFinite(parsed) ? Math.max(1, Math.min(100, Math.floor(parsed))) : 30;

    let cursorDate: Date | undefined;
    if (cursor) {
      const parsedDate = new Date(cursor);
      if (Number.isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Invalid cursor');
      }
      cursorDate = parsedDate;
    }

    const rows = await this.prisma.message.findMany({
      where: {
        conversationId: conversation.id,
        ...(cursorDate ? { createdAt: { lt: cursorDate } } : {}),
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      select: {
        id: true,
        senderId: true,
        body: true,
        createdAt: true,
      },
    });

    const hasMore = rows.length > limit;
    const page = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? page[page.length - 1]?.createdAt.toISOString() ?? null : null;

    return {
      conversationId: conversation.id,
      messages: page.reverse().map((row) => this.toMessageView(row, conversation, currentUserId)),
      nextCursor,
    };
  }
}
