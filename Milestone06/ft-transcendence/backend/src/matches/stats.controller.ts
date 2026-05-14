import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { MatchesService } from './matches.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get('me/stats')
  getMyStats(@CurrentUser() user: { id: string }) {
    return this.matchesService.getMyStats(user.id);
  }

  @Get('me/matches')
  getMyMatches(
    @CurrentUser() user: { id: string },
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.matchesService.getMyMatches(user.id, cursor, limit);
  }

  @Get('leaderboard')
  getLeaderboard(@Query('limit') limit?: string) {
    return this.matchesService.getLeaderboard(limit);
  }
}
