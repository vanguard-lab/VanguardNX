import type { Params } from 'nestjs-pino';
import type { SentryModuleOptions } from '@ntegral/nestjs-sentry';
import { IDbOptions } from '../db';

export interface IUsersMsConfig {
  logger: Params;
  sentry: SentryModuleOptions;
  database: IDbOptions;
}
