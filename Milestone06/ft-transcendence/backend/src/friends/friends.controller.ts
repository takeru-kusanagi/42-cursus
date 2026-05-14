import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { FriendsService } from './friends.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('friends/:id')
  request(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.friendsService.request(user.id, id);
  }

  @Post('friends/:id/accept')
  accept(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.friendsService.accept(user.id, id);
  }

  @Delete('friends/:id')
  remove(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.friendsService.remove(user.id, id);
  }

  @Get('me/friends')
  listFriends(@CurrentUser() user: { id: string }) {
    return this.friendsService.listFriends(user.id);
  }

  @Get('me/friend-requests')
  listRequests(@CurrentUser() user: { id: string }) {
    return this.friendsService.listIncomingRequests(user.id);
  }
}
