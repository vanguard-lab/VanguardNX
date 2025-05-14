import { EMPTY_STR } from '@vanguard-nx/utils';
import { isDev, isLocal } from '../tools';
import type { SentryModuleOptions } from '@ntegral/nestjs-sentry';

export const generateSentryConfig = (params?: SentryModuleOptions): SentryModuleOptions => {
  return {
    dsn: process.env.SENTRY_DSN,
    debug: isLocal() || isDev(),
    environment: process.env.NODE_ENVIRONMENT || process.env.NODE_ENV,
    release: EMPTY_STR,
    logLevels: ['debug'],
    enabled: !isLocal(),
    ...params,
  };
};
