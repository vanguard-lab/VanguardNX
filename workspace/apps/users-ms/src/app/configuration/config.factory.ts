import { generateLoggerConfig, generateSentryConfig } from '@vanguard-nx/core';
import { EMPTY_STR, parseInt } from '@vanguard-nx/utils';
import type { IUsersMsConfig } from './i-users-ms.config';
import { DEFAULT_DATABASE, DEFAULT_DB_HOST, DEFAULT_DB_PORT, DEFAULT_DB_USER } from '../db';

export const configFactory = (): IUsersMsConfig => {
  const logger = generateLoggerConfig();
  const sentry = generateSentryConfig();

  return {
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
