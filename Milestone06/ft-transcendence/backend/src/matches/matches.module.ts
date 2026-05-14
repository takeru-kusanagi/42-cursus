import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { StatsController } from './stats.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MatchesController, StatsController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
