import { RequestMethod } from '@nestjs/common';
import { EMPTY_STR, isNilOrEmpty } from '@vanguard-nx/utils';
import type { Params } from 'nestjs-pino';
import { isLocal } from '../tools';

const HOME_REQ_DATA = { path: EMPTY_STR, method: RequestMethod.GET };

const getTransport = (): any => {
  if (!isLocal()) {
    // Use pino-pretty in Local environment only
    return undefined;
  }

  return {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
      ignore: 'pid,hostname,req.headers',
    },
  };
};

export const generateLoggerConfig = (): Params => {
  const result: Params = {
    forRoutes: ['*'], // solves the issue https://github.com/iamolegga/nestjs-pino/issues/1849#issuecomment-2296337934
    pinoHttp: {
      level: 'debug',
      transport: getTransport(),
      autoLogging: true,
    },
  };

  result.exclude = isNilOrEmpty(result?.exclude) ? [HOME_REQ_DATA] : [HOME_REQ_DATA, ...(result.exclude ?? [])];
  return result;
};
