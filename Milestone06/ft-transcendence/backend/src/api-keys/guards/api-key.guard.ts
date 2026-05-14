import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeysService } from '../api-keys.service';
import { API_KEY_SCOPES } from '../decorators/api-key-scopes.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeysService: ApiKeysService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'] as string;

    if (!apiKey) {
      throw new UnauthorizedException('Missing X-API-Key header');
    }

    const result = await this.apiKeysService.validateKey(apiKey);
    if (!result) {
      throw new UnauthorizedException('Invalid or expired API key');
    }

    // @RequireScopes() で指定されたスコープを確認
    const requiredScopes = this.reflector.get<string[]>(
      API_KEY_SCOPES,
      context.getHandler(),
    );

    if (requiredScopes && requiredScopes.length > 0) {
      const hasScope = requiredScopes.every((s) => result.scopes.includes(s));
      if (!hasScope) {
        throw new ForbiddenException(
          `Insufficient scope. Required: ${requiredScopes.join(', ')}`,
        );
      }
    }

    request.apiKeyUser = result.user;
    request.apiKeyScopes = result.scopes;

    return true;
  }
}
