import { SetMetadata } from '@nestjs/common';

export const API_KEY_SCOPES = 'api_key_scopes';

/** 必要なスコープを指定するデコレータ。ApiKeyGuard と併用する。 */
export const RequireScopes = (...scopes: string[]) =>
  SetMetadata(API_KEY_SCOPES, scopes);
