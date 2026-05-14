import { Module } from '@nestjs/common';
import { ChatsModule } from '../chats/chats.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [ChatsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
