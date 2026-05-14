import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatsPresenceService {
  private readonly connections = new Map<string, number>();

  markConnected(userId: string) {
    this.connections.set(userId, (this.connections.get(userId) ?? 0) + 1);
  }

  markDisconnected(userId: string) {
    const current = this.connections.get(userId) ?? 0;
    if (current <= 1) {
      this.connections.delete(userId);
      return;
    }
    this.connections.set(userId, current - 1);
  }

  isActive(userId: string) {
    return (this.connections.get(userId) ?? 0) > 0;
  }
}
