import { ILogger, ILoggerConfig } from './types';

/**
 * Default logger implementation using console.log.
 * @implements {ILogger}
 */

class DefaultLogger implements ILogger {
  /**
   * Logs a message with optional parameter.
   * @param {string} message - The message to log
   * @param {any} [param] - Optional parameter to log
   */
  public log(message: string, param?: any): void {
    console.log(message, param ?? '');
  }
}

/**
 * Static logger utility class for centralized logging.
 */
export class Logger {
  private static config: ILoggerConfig = { enabled: false, logger: new DefaultLogger() };

  /**
   * Configures the logger with provided settings.
   * @param {ILoggerConfig} config - Logger configuration object
   */
  public static configure(config: ILoggerConfig): void {
    this.config = { ...config, logger: config.logger ?? new DefaultLogger() };
  }

  /**
   * Logs a message if logging is enabled.
   * @param {string} message - The message to log
   * @param {any} [param] - Optional parameter to log
   */
  public static log(message: string, param?: unknown): void {
    if (this.config.enabled) this.config.logger!.log(message, param);
  }
}
