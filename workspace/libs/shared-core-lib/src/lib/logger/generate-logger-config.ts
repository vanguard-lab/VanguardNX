import { RequestMethod } from '@nestjs/common';
import { EMPTY_STR } from '@vanguard-nx/utils';
import { IncomingMessage } from 'http';
import type { Params } from 'nestjs-pino';
import { isLocal } from '../tools';

const HOME_REQ_DATA = { path: EMPTY_STR, method: RequestMethod.GET };

interface RequestWithRoute extends IncomingMessage {
  route?: { path: string };
  url?: string;
}

const getTransport = (): any => {
  if (!isLocal()) return undefined;

  return {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
      ignore: 'pid,hostname',
      singleLine: false,
      messageFormat: '[{context}] {levelLabel} {req.method} {req.url} | {msg}',
      errorLikeObjectKeys: ['err', 'error'],
      customColors: 'trace:gray,debug:blue,info:green,warn:yellow,error:red,fatal:bgRed',
      customLevels: 'trace:10,debug:20,info:30,warn:40,error:50,fatal:60',
    },
  };
};

export const generateLoggerConfig = (): Params => {
  const config: Params = {
    forRoutes: ['*'],
    exclude: [HOME_REQ_DATA],
    pinoHttp: {
      level: isLocal() ? 'debug' : 'info',
      transport: getTransport(),
      autoLogging: {
        ignore: (req) => req.url === '/health' || req.url === '/metrics',
      },
      customProps: (req: RequestWithRoute) => ({
        context: (req as any).route?.path || req.url || 'HTTP',
      }),
      customAttributeKeys: {
        req: 'req',
        res: 'res',
        err: 'err',
        responseTime: 'responseTime',
      },
      serializers: {
        req: (req) => ({
          method: req.method,
          url: req.url,
          params: req.params,
          query: req.query,
        }),
        res: (res) => ({
          statusCode: res.statusCode,
        }),
      },
      // TODO: once auth is implemented, redact sensitive info
      // redact: {
      //   paths: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password', 'req.body.token'],
      //   remove: true,
      // },
      customLogLevel: (_req, res, err) => {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (res.statusCode >= 500 || err) return 'error';
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
    },
  };

  return config;
};
