
import type { Params } from "nestjs-pino";
import type { SentryModuleOptions } from "@ntegral/nestjs-sentry";

export interface IUsersMsConfig {

  logger: Params;
  sentry: SentryModuleOptions;

}
