import { Mapper } from '@automapper/core';
import { isNil } from '@vanguard-nx/utils';
import { Type } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ObjectLiteral, Repository } from 'typeorm';
import { ArgumentNilException } from '../exceptions';
import { DbException } from './db-exception';
import { IReadOnlyRepo } from './i-read-only.repo';

export abstract class BaseReadOnlyRepo<TEntity extends ObjectLiteral, T, TKey> implements IReadOnlyRepo<T, TKey> {
  constructor(
    protected readonly internalRepo: Repository<TEntity>,
    protected readonly mapper: Mapper,
    protected readonly logger: PinoLogger,
    protected readonly entityType: Type<TEntity>,
    protected readonly domainType: Type<T>,
  ) {}

  public get idColumnName(): keyof TEntity {
    return 'id' as keyof TEntity;
  }

  public async getAsync(pk: TKey): Promise<T | null> {
    try {
      if (isNil(pk)) {
        throw new ArgumentNilException();
      }
      const key = typeof pk === 'object' ? { ...pk } : { [this.idColumnName]: pk };
      const e = await this.internalRepo.findOneBy(key as any);
      if (this.isDeleted(e)) {
        return null;
      }
      return this.mapToModel(e);
    } catch (ex) {
      this.logger.error(ex);
      throw new DbException(ex);
    }
  }

  protected mapToModel(entity: TEntity | null): T {
    return this.mapper.map(entity, this.entityType, this.domainType);
  }

  protected isDeleted(entity: TEntity | null): boolean {
    return isNil(entity);
  }
}
