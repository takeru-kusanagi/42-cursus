import { Controller, Get, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  search(@CurrentUser() user: { id: string }, @Query('q') query = '') {
    return this.usersService.search(user.id, query);
  }

  @Patch('me/avatar')
  updateAvatar(
    @CurrentUser() user: { id: string },
    @Body('avatar') avatar: string,
  ) {
    return this.usersService.updateAvatar(user.id, avatar);
  }

  @Get(':id')
  profile(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.usersService.getProfile(user.id, id);
  }
}
