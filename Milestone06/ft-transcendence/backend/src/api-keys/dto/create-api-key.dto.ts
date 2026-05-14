export interface CreateApiKeyDto {
  name: string;
  scopes?: string[];
  expiresAt?: string;
}
