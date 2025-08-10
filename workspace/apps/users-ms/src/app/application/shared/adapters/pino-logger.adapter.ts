import { Injectable } from '@nestjs/common';
import { ILogger } from '@vanguard-nx/core';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class PinoLoggerAdapter implements ILogger {
  constructor(private readonly pinoLogger: PinoLogger) {}

  public log(message: string, param?: never): void {
    if (param !== undefined) {
      this.pinoLogger.info({ param }, message);
    } else {
      this.pinoLogger.info(message);
    }
  }
}
