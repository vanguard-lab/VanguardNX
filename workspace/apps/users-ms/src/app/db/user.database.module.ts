import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IDbOptions } from './options';
import { generateDataSourceOptions } from './type-orm.config';

import Entities from './entities';
import { USER_REPO } from '../application';
import { UserRepo } from './repositories';

@Module({})
export class UserDatabaseModule {
  public static forRoot(): DynamicModule {
    return {
      global: true,
      module: UserDatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const opts = configService.get<IDbOptions>('database');
            return {
              ...generateDataSourceOptions(opts),
              retryAttempts: opts?.retryAttempts,
              retryDelay: opts?.retryDelay,
              toRetry: opts?.toRetry,
            };
          },
        }),
        TypeOrmModule.forFeature([...Entities]),
      ],
      providers: [
        {
          provide: USER_REPO,
          useClass: UserRepo,
        },
      ],
      exports: [USER_REPO],
    };
  }
}
