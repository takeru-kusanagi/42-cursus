import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { ChatsPresenceService } from './chats.presence.service';
import { ChatsService } from './chats.service';

@Module({
  imports: [AuthModule],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsPresenceService, ChatsGateway],
  exports: [ChatsService, ChatsPresenceService],
})
export class ChatsModule {}
