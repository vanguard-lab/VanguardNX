import { Environment, generateLoggerConfig, generateSentryConfig } from '@vanguard-nx/core';
import { EMPTY_STR, parseInt } from '@vanguard-nx/utils';
import type { IUsersMsConfig } from './i-users-ms.config';

const API_PORT = 3000;
const GLOBAL_PREFIX = 'users';
const API_HOST = '0.0.0.0';
const API_DOMAIN = `http://localhost:${API_PORT}`;
export const DEFAULT_DB_HOST = '127.0.0.1';
export const DEFAULT_DB_PORT = 26257;
export const DEFAULT_DB_USER = 'root';
export const DEFAULT_DATABASE = 'user_db';

export const configFactory = (): IUsersMsConfig => {
  const logger = generateLoggerConfig();
  const sentry = generateSentryConfig();

  return {
    api: {
      env: (process.env?.NODE_ENV as Environment) ?? 'local',
      domain: process.env?.API_DOMAIN ?? API_DOMAIN,
      host: process.env?.API_HOST ?? API_HOST,
      port: parseInt(process.env?.API_PORT) ?? API_PORT,
      globalPrefix: process.env?.GLOBAL_PREFIX ?? GLOBAL_PREFIX,
    },
    logger,
    sentry,
    database: {
      host: process.env?.DB_HOST ?? DEFAULT_DB_HOST,
      port: parseInt(process.env?.DB_PORT) ?? DEFAULT_DB_PORT,
      username: process.env?.DB_USER ?? DEFAULT_DB_USER,
      password: process.env?.DB_PASS ?? EMPTY_STR,
      database: process.env?.DB_NAME ?? DEFAULT_DATABASE,
    },
  };
};
