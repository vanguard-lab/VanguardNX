import { RequestMethod } from '@nestjs/common';
import { EMPTY_STR, isNilOrEmpty } from '@vanguard-nx/utils';
import type { Params } from 'nestjs-pino';
import { isLocal } from '../tools';

const HOME_REQ_DATA = { path: EMPTY_STR, method: RequestMethod.GET };

const getTransport = (): any => {
  if (!isLocal()) {
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
    pinoHttp: {
      level: 'debug',
      transport: getTransport(),
    },
  };

  result.exclude = isNilOrEmpty(result?.exclude) ? [HOME_REQ_DATA] : [HOME_REQ_DATA, ...(result.exclude ?? [])];
  return result;
};
