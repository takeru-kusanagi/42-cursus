import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PublicApiController } from './public-api.controller';
import { PublicApiService } from './public-api.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { ExportService } from '../auth/export.service';

@Module({
  imports: [
    PrismaModule,
    ApiKeysModule,
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
  ],
  controllers: [PublicApiController],
  providers: [PublicApiService, ExportService],
})
export class PublicApiModule {}
