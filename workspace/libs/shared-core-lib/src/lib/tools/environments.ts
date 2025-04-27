export type Environment = "development" | "production" | "test" | "staging" | "local";

export const dotEnvName = (): string =>
  `.env${ 
  (process.env.NODE_ENV?.trim() as Environment) !== "production" ? `.${  process.env.NODE_ENV?.trim() ?? ""}` : ""}`;

export const isDev = (): boolean => (process.env.NODE_ENV?.trim() as Environment) === "development";
export const isProd = (): boolean => (process.env.NODE_ENV?.trim() as Environment) === "production";
export const isTest = (): boolean => (process.env.NODE_ENV?.trim() as Environment) === "test";
export const isStaging = (): boolean => (process.env.NODE_ENV?.trim() as Environment) === "staging";
export const isLocal = (): boolean => (process.env.NODE_ENV?.trim() as Environment) === "local";

export const currentEnv = (): Environment => (process.env.NODE_ENV?.trim() as Environment)