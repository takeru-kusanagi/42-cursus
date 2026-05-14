import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { MatchesService } from './matches.service';

@Controller('matches')
@UseGuards(JwtAuthGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('start')
  startMatch(
    @CurrentUser() user: { id: string },
    @Body('mode') mode: string,
  ) {
    return this.matchesService.startMatch(user.id, mode);
  }

  @Post(':matchId/finalize')
  finalizeMatch(
    @CurrentUser() user: { id: string },
    @Param('matchId') matchId: string,
    @Body('players') players: Array<{ userId: string; score: number; isWinner: boolean }>,
    @Body('status') status?: string,
    @Body('endedAt') endedAt?: string,
  ) {
    return this.matchesService.finalizeMatch(user.id, matchId, players, status, endedAt);
  }
}
