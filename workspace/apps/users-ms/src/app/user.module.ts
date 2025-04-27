import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { DynamicModule, Module } from '@nestjs/common';
import { VanguardNxSharedCoreLibModule } from '@vanguard-nx/core';
import { LoggerModule, Params } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configFactory, IUsersMsConfig } from './configuration';
import { SentryModule, SentryModuleOptions } from '@ntegral/nestjs-sentry';
import { ApplicationModule } from './application';

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
          useFactory: (config: ConfigService<IUsersMsConfig>) => {
            const c = config.get<Params>('logger');
            console.log('>>>>>>>>>>>>>>>>>>> CONFIGS', c);
            return c;
          },
        }),
        SentryModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (config: ConfigService<IUsersMsConfig>) =>
            config.get<SentryModuleOptions>('sentry'),
          inject: [ConfigService],
        }),
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
        VanguardNxSharedCoreLibModule.forRoot(),
        ApplicationModule.forRoot(),
      ],
      providers: [],
      exports: [VanguardNxSharedCoreLibModule],
    };
  }
}
