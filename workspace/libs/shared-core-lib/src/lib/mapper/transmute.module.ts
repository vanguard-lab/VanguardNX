import { Module } from '@nestjs/common';
import { VANGUARD_TRANSMUTE } from './decorators';
import { Logger } from './logger';
import { VanguardTransmute } from './transmute';
import { ObjectMapperModuleAsyncOptions, ObjectMapperModuleOptions } from './types';

@Module({
  providers: [{ provide: VANGUARD_TRANSMUTE, useClass: VanguardTransmute }],
  exports: [VANGUARD_TRANSMUTE],
})
/**
 * NestJS module for ObjectMapper dependency injection.
 * @module
 */
export class VanguardTransmuteModule {
  /**
   * Configures the module for root with synchronous options.
   * @param {ObjectMapperModuleOptions} [options={}] - Module configuration options
   * @returns {any} Module configuration object
   */
  public static forRoot(options: ObjectMapperModuleOptions = {}): any {
    if (options.logging) Logger.configure(options.logging);
    return { module: VanguardTransmuteModule, global: true, providers: [{ provide: VANGUARD_TRANSMUTE, useClass: VanguardTransmute }], exports: [VANGUARD_TRANSMUTE] };
  }

  /**
   * Configures the module for root with asynchronous options.
   * @param {ObjectMapperModuleAsyncOptions} options - Async module configuration options
   * @returns {any} Module configuration object
   */
  public static forRootAsync(options: ObjectMapperModuleAsyncOptions): any {
    return {
      module: VanguardTransmuteModule,
      global: true,
      imports: options.imports ?? [],
      providers: [
        {
          provide: 'OBJECT_MAPPER_OPTIONS',
          inject: options.inject ?? [],
          useFactory: async (...args: any[]) => {
            const moduleOptions = await options.useFactory(...args);
            if (moduleOptions.logging) Logger.configure(moduleOptions.logging);
            return moduleOptions;
          },
        },
        { provide: VANGUARD_TRANSMUTE, useClass: VanguardTransmute },
      ],
      exports: [VANGUARD_TRANSMUTE],
    };
  }
}
