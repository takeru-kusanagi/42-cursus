export interface BulkOperation {
  action: string;
  params?: Record<string, unknown>;
}

export interface BulkResult {
  action: string;
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface BulkResponse {
  results: BulkResult[];
}
