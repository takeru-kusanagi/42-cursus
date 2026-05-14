import { HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { ChatsPresenceService } from './chats.presence.service';
import { ChatsService } from './chats.service';

type ChatSendPayload = {
  toUserId?: string;
  text?: string;
};

@WebSocketGateway({
  namespace: '/ws/chat',
  cors: { origin: '*' },
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  private readonly sendHistory = new Map<string, number[]>();
  private readonly rateLimitWindowMs = 5000;
  private readonly rateLimitCount = 20;

  constructor(
    private readonly chatsService: ChatsService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly presenceService: ChatsPresenceService,
  ) {}

  private userRoom(userId: string) {
    return `chat:user:${userId}`;
  }

  private extractToken(socket: Socket): string | null {
    const authToken =
      typeof socket.handshake.auth?.token === 'string' ? socket.handshake.auth.token : null;
    const queryToken =
      typeof socket.handshake.query?.token === 'string'
        ? socket.handshake.query.token
        : Array.isArray(socket.handshake.query?.token)
          ? socket.handshake.query.token[0]
          : null;
    const headerAuth =
      typeof socket.handshake.headers?.authorization === 'string'
        ? socket.handshake.headers.authorization
        : null;

    const raw = authToken ?? queryToken ?? headerAuth;
    if (!raw) return null;

    return raw.startsWith('Bearer ') ? raw.slice(7) : raw;
  }

  private async authenticate(socket: Socket): Promise<string | null> {
    const token = this.extractToken(socket);
    if (!token) return null;

    try {
      const payload = await this.jwtService.verifyAsync<{ sub?: string }>(token, {
        secret: process.env.JWT_SECRET || 'dev_jwt_secret_min_32_chars_for_local',
      });
      if (!payload?.sub) return null;
      const user = await this.authService.validateUser(payload.sub);
      return user?.id ?? null;
    } catch {
      return null;
    }
  }

  private hitRateLimit(userId: string): boolean {
    const now = Date.now();
    const windowStart = now - this.rateLimitWindowMs;
    const recent = (this.sendHistory.get(userId) ?? []).filter((ts) => ts > windowStart);

    if (recent.length >= this.rateLimitCount) {
      this.sendHistory.set(userId, recent);
      return true;
    }

    recent.push(now);
    this.sendHistory.set(userId, recent);
    return false;
  }

  private toWsException(error: unknown): WsException {
    if (error instanceof HttpException) {
      const payload = error.getResponse();
      if (typeof payload === 'string') {
        return new WsException(payload);
      }
      if (
        payload &&
        typeof payload === 'object' &&
        'message' in payload &&
        typeof payload.message === 'string'
      ) {
        return new WsException(payload.message);
      }
      return new WsException(error.message);
    }
    return new WsException('Failed to process chat message');
  }

  async handleConnection(socket: Socket) {
    const userId = await this.authenticate(socket);
    if (!userId) {
      socket.disconnect(true);
      return;
    }

    socket.data.userId = userId;
    this.presenceService.markConnected(userId);
    await socket.join(this.userRoom(userId));
  }

  handleDisconnect(socket: Socket) {
    const userId = typeof socket.data.userId === 'string' ? socket.data.userId : null;
    if (userId) {
      this.presenceService.markDisconnected(userId);
    }
  }

  @SubscribeMessage('chat:send')
  async handleChatSend(@ConnectedSocket() socket: Socket, @MessageBody() payload: ChatSendPayload) {
    const fromUserId = typeof socket.data.userId === 'string' ? socket.data.userId : null;
    if (!fromUserId) {
      throw new WsException('Unauthorized');
    }
    if (this.hitRateLimit(fromUserId)) {
      throw new WsException('Too many messages. Please retry shortly.');
    }

    const toUserId = typeof payload?.toUserId === 'string' ? payload.toUserId : '';
    const text = typeof payload?.text === 'string' ? payload.text : '';

    try {
      const message = await this.chatsService.sendMessage(fromUserId, toUserId, text);

      this.server.to(this.userRoom(fromUserId)).to(this.userRoom(toUserId)).emit('chat:message', {
        fromUserId: message.fromUserId,
        toUserId: message.toUserId,
        text: message.text,
        createdAt: message.createdAt,
      });

      return { ok: true, message };
    } catch (error) {
      throw this.toWsException(error);
    }
  }
}
