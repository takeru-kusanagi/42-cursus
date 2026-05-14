import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { UsersModule } from './users/users.module';
import { FriendsModule } from './friends/friends.module';
import { ChatsModule } from './chats/chats.module';
import { AdminModule } from './admin/admin.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { PublicApiModule } from './public-api/public-api.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [PrismaModule, EventsModule, MailModule, AuthModule, UsersModule, FriendsModule, ChatsModule, AdminModule, ApiKeysModule, PublicApiModule, MatchesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
