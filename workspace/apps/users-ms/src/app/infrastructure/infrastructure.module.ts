import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_REPO } from '../application';
import { EntityMapperProfile, generateDataSourceOptions, IDbOptions, UserRepo } from './persistence';
import Entities from './persistence/entities';

@Module({})
export class InfrastructureModule {
  public static forRoot(): DynamicModule {
    return {
      global: true,
      module: InfrastructureModule,
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
        EntityMapperProfile,
      ],

      exports: [USER_REPO, EntityMapperProfile],
    };
  }
}
