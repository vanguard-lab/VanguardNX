import { Environment } from '@vanguard-nx/core';

export interface IApiOptions {
  env: Environment;
  domain: string;
  host: string;
  port: number;
  globalPrefix: string;
}
