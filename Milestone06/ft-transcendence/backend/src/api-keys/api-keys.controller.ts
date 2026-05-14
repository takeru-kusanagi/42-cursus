import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('API Key Management')
@ApiBearerAuth('jwt')
@Controller('auth/api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  @ApiOperation({ summary: 'APIキー生成', description: '新しいAPIキーを生成する。平文キーはこのレスポンスでのみ返却される。' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', description: 'キーの識別名 (1-64文字)', example: 'My Bot' },
        scopes: {
          type: 'array',
          items: { type: 'string', enum: ['read', 'write', 'delete'] },
          description: '許可スコープ (default: ["read"])',
          example: ['read', 'write'],
        },
        expiresAt: { type: 'string', format: 'date-time', description: '有効期限 (省略で無期限)' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'APIキーが生成された（平文キーを含む）' })
  @ApiResponse({ status: 400, description: 'バリデーションエラー' })
  async create(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateApiKeyDto,
  ) {
    return this.apiKeysService.create(
      user.id,
      dto.name,
      dto.scopes,
      dto.expiresAt,
    );
  }

  @Get()
  @ApiOperation({ summary: 'APIキー一覧', description: '自分のAPIキー一覧を取得する。平文キーは含まれない。' })
  @ApiResponse({ status: 200, description: 'APIキー一覧' })
  async findAll(@CurrentUser() user: { id: string }) {
    return this.apiKeysService.findAllByUser(user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'APIキー失効', description: '指定IDのAPIキーを失効させる（論理削除）。' })
  @ApiParam({ name: 'id', description: 'APIキーID' })
  @ApiResponse({ status: 200, description: 'APIキーが失効された' })
  @ApiResponse({ status: 404, description: 'APIキーが見つからない' })
  async revoke(
    @CurrentUser() user: { id: string },
    @Param('id') keyId: string,
  ) {
    return this.apiKeysService.revoke(user.id, keyId);
  }
}
