import { Controller, Get, Post, Put, Delete, Query, Param, Req, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiSecurity, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { PublicApiService } from './public-api.service';
import { ApiKeyGuard } from '../api-keys/guards/api-key.guard';
import { RequireScopes } from '../api-keys/decorators/api-key-scopes.decorator';

@ApiTags('Public API (v1)')
@ApiSecurity('api-key')
@Controller('v1')
@UseGuards(ThrottlerGuard, ApiKeyGuard)
@Throttle({ default: { limit: 100, ttl: 60000 } })
export class PublicApiController {
  constructor(private readonly publicApiService: PublicApiService) {}

  // ─── Users ───────────────────────────────

  @Get('users')
  @RequireScopes('read')
  @ApiOperation({ summary: 'ユーザー一覧取得', description: 'ページネーション付きでユーザー一覧を返す。Scope: read' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'ページ番号 (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '1ページあたりの件数 (default: 20, max: 100)' })
  @ApiResponse({ status: 200, description: 'ユーザー一覧' })
  @ApiResponse({ status: 401, description: 'APIキーが無効または未指定' })
  async getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.publicApiService.getUsers(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('users/:id')
  @RequireScopes('read')
  @ApiOperation({ summary: 'ユーザー詳細取得', description: '指定IDのユーザー公開プロフィールを返す。Scope: read' })
  @ApiParam({ name: 'id', description: 'ユーザーID' })
  @ApiResponse({ status: 200, description: 'ユーザー詳細' })
  @ApiResponse({ status: 404, description: 'ユーザーが見つからない' })
  async getUserById(@Param('id') id: string) {
    return this.publicApiService.getUserById(id);
  }

  // ─── Games ───────────────────────────────

  @Get('games')
  @RequireScopes('read')
  @ApiOperation({ summary: '試合一覧取得', description: 'フィルタ・ページネーション付きで試合一覧を返す。Scope: read' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: false, description: '特定ユーザーの試合のみ取得' })
  @ApiQuery({ name: 'status', required: false, enum: ['IN_PROGRESS', 'COMPLETED', 'ABANDONED'] })
  @ApiResponse({ status: 200, description: '試合一覧' })
  async getGames(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('userId') userId?: string,
    @Query('status') status?: string,
  ) {
    return this.publicApiService.getGames(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      userId,
      status,
    );
  }

  @Get('games/:id')
  @RequireScopes('read')
  @ApiOperation({ summary: '試合詳細取得', description: '指定IDの試合詳細を返す。Scope: read' })
  @ApiParam({ name: 'id', description: '試合ID' })
  @ApiResponse({ status: 200, description: '試合詳細' })
  @ApiResponse({ status: 404, description: '試合が見つからない' })
  async getGameById(@Param('id') id: string) {
    return this.publicApiService.getGameById(id);
  }

  // ─── Friends ──────────────────────────────

  @Post('friends/:userId')
  @RequireScopes('write')
  @ApiOperation({ summary: 'フレンドリクエスト送信', description: 'APIキー所有者から指定ユーザーにフレンド申請を送る。Scope: write' })
  @ApiParam({ name: 'userId', description: '申請先のユーザーID' })
  @ApiResponse({ status: 201, description: 'フレンドリクエストが送信された' })
  @ApiResponse({ status: 400, description: '自分自身への申請' })
  @ApiResponse({ status: 404, description: 'ユーザーが見つからない' })
  @ApiResponse({ status: 409, description: '既にフレンド関係が存在する' })
  async sendFriendRequest(
    @Req() req: { apiKeyUser: { id: string } },
    @Param('userId') userId: string,
  ) {
    return this.publicApiService.sendFriendRequest(req.apiKeyUser.id, userId);
  }

  @Put('friends/:userId/accept')
  @RequireScopes('write')
  @ApiOperation({ summary: 'フレンド申請の承認', description: '指定ユーザーからのフレンド申請を承認する。Scope: write' })
  @ApiParam({ name: 'userId', description: '申請元のユーザーID' })
  @ApiResponse({ status: 200, description: 'フレンドリクエストが承認された' })
  @ApiResponse({ status: 404, description: 'フレンドリクエストが見つからない' })
  @ApiResponse({ status: 409, description: 'PENDING状態ではない' })
  async acceptFriendRequest(
    @Req() req: { apiKeyUser: { id: string } },
    @Param('userId') userId: string,
  ) {
    return this.publicApiService.acceptFriendRequest(req.apiKeyUser.id, userId);
  }

  @Get('friends')
  @RequireScopes('read')
  @ApiOperation({ summary: 'フレンド一覧取得', description: 'APIキー所有者の承認済みフレンド一覧を返す。Scope: read' })
  @ApiResponse({ status: 200, description: 'フレンド一覧' })
  async getFriends(@Req() req: { apiKeyUser: { id: string } }) {
    return this.publicApiService.getFriends(req.apiKeyUser.id);
  }

  @Delete('friends/:userId')
  @RequireScopes('delete')
  @ApiOperation({ summary: 'フレンド解除', description: 'APIキー所有者と指定ユーザーのフレンド関係を削除する。Scope: delete' })
  @ApiParam({ name: 'userId', description: '解除対象のユーザーID' })
  @ApiResponse({ status: 200, description: 'フレンドが解除された' })
  @ApiResponse({ status: 404, description: 'フレンド関係が見つからない' })
  async removeFriend(
    @Req() req: { apiKeyUser: { id: string } },
    @Param('userId') userId: string,
  ) {
    return this.publicApiService.removeFriend(req.apiKeyUser.id, userId);
  }

  // ─── Rankings ────────────────────────────

  @Get('rankings')
  @RequireScopes('read')
  @ApiOperation({ summary: 'ランキング取得', description: 'レーティング順のユーザーランキングを返す。Scope: read' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: '取得件数 (default: 20, max: 100)' })
  @ApiResponse({ status: 200, description: 'ランキング一覧' })
  async getRankings(@Query('limit') limit?: string) {
    return this.publicApiService.getRankings(
      limit ? parseInt(limit, 10) : 20,
    );
  }

  // ─── Bulk Operations ───────────────────────

  @Post('bulk')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({
    summary: 'バルク操作',
    description:
      '最大10件の操作を1リクエストで実行する。各操作のスコープは個別に検証される。' +
      '部分的な成功を許容し、各結果に success/error を格納する。',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        operations: {
          type: 'array',
          maxItems: 10,
          items: {
            type: 'object',
            required: ['action'],
            properties: {
              action: {
                type: 'string',
                enum: [
                  'getUsers', 'getUser', 'getGames', 'getGame',
                  'getFriends', 'getRankings', 'exportData',
                  'sendFriendRequest', 'acceptFriendRequest',
                  'removeFriend', 'deleteGames',
                ],
              },
              params: { type: 'object' },
            },
          },
        },
      },
      required: ['operations'],
    },
  })
  @ApiResponse({ status: 200, description: 'バルク操作結果（部分成功あり）' })
  @ApiResponse({ status: 400, description: '不正なリクエスト（配列でない、空、11件以上）' })
  @ApiResponse({ status: 401, description: 'APIキーが無効または未指定' })
  async bulk(
    @Req() req: { apiKeyUser: { id: string }; apiKeyScopes: string[] },
    @Body() body: { operations: { action: string; params?: Record<string, unknown> }[] },
  ) {
    return this.publicApiService.executeBulk(
      body.operations,
      req.apiKeyUser.id,
      req.apiKeyScopes,
    );
  }
}
