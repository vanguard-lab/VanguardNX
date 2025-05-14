// @ts-ignore: Strict checks
export interface IDbOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  retryAttempts?: number;
  retryDelay?: number;
  toRetry?: (err: unknown) => boolean;
}
