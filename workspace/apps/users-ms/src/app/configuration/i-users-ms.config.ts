import type { SentryModuleOptions } from '@ntegral/nestjs-sentry';
import type { Params } from 'nestjs-pino';
import { IDbOptions } from '../infrastructure';
import { IApiOptions } from './i-api.options';

export interface IUsersMsConfig {
  api: IApiOptions;
  logger: Params;
  sentry: SentryModuleOptions;
  database: IDbOptions;
}
