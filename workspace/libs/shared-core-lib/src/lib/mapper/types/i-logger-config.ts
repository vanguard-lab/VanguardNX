import { ILogger } from './i-logger';

export interface ILoggerConfig {
  enabled: boolean;
  logger?: ILogger;
}
