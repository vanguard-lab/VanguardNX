import type { IUsersMsConfig } from "./i-users-ms.config";
import { generateLoggerConfig, generateSentryConfig, } from "@vanguard-nx/core";





export const configFactory = (): IUsersMsConfig => {
  const logger = generateLoggerConfig();
  const sentry = generateSentryConfig();

  return {




    logger,
    sentry,



  };
};
