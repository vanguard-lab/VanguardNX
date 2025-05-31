import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryInterceptor, SentryModule, SentryModuleOptions } from '@ntegral/nestjs-sentry';
import { VanguardNxSharedCoreLibModule } from '@vanguard-nx/core';
import { LoggerModule, Params } from 'nestjs-pino';
import { ApplicationModule } from './application';
import { configFactory, IUsersMsConfig } from './configuration';
import { InfrastructureModule } from './infrastructure';
@Module({})
export class UsersModule {
  public static forRoot(): DynamicModule {
    return {
      global: true,
      module: UsersModule,
      imports: [
        ConfigModule.forRoot({
          load: [configFactory],
          isGlobal: true,
        }),
        LoggerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService<IUsersMsConfig>) => config.get<Params>('logger')!,
        }),
        SentryModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (config: ConfigService<IUsersMsConfig>) => config.get<SentryModuleOptions>('sentry')!,
          inject: [ConfigService],
        }),
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
        VanguardNxSharedCoreLibModule.forRoot(),
        ApplicationModule.forRoot(),
        InfrastructureModule.forRoot(),
      ],
      providers: [
        {
          provide: APP_INTERCEPTOR,
          useFactory: () => new SentryInterceptor(),
        },
      ],
      exports: [VanguardNxSharedCoreLibModule],
    };
  }
}
