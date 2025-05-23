import { parseInt } from '@vanguard-nx/utils';
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import Entities from './entities';
import { IDbOptions } from './options';

const MAX_POOL_SIZE = 100;
const CONNECTION_TIMEOUT_MILLIS = 1000;

export const generateDataSourceOptions = (options?: IDbOptions): DataSourceOptions => {
  const dataSource: DataSourceOptions = {
    type: 'cockroachdb',
    timeTravelQueries: false,
    host: options?.host ?? process.env?.DB_HOST,
    port: parseInt(options?.port ?? process.env?.DB_PORT)!,
    username: options?.username ?? process.env?.DB_USER,
    password: options?.password ?? process.env?.DB_PASS,
    database: options?.database ?? process.env?.DB_NAME,
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
    logging: true,
    entities: [...Entities],
    migrations: [__dirname + '/migrations/*-migration{.ts,.js}'],
    migrationsTransactionMode: 'none',
    ssl: false,
    extra: {
      // based on  https://node-postgres.com/apis/pool
      max: MAX_POOL_SIZE,
      connectionTimeoutMillis: CONNECTION_TIMEOUT_MILLIS,
    },
  };

  return dataSource;
};

export default new DataSource(generateDataSourceOptions());
