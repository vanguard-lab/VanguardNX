import { Type } from '@nestjs/common';
import { ILoggerConfig } from './i-logger-config';

export interface ObjectMapperModuleOptions {
  profiles?: Type[];
  logging?: ILoggerConfig;
}
