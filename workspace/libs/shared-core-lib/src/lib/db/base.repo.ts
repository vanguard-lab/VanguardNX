import { Type } from '@nestjs/common';
import { includes, keys } from '@vanguard-nx/utils';
import { PinoLogger } from 'nestjs-pino';
import { ObjectLiteral, Repository } from 'typeorm';
import { BaseReadOnlyRepo } from './base-read-only.repo';
import { DbException } from './db-exception';
import { IBaseRepo } from './i-base.repo';
import { ITransmute } from '../mapper';

export abstract class BaseRepo<TEntity extends ObjectLiteral, T, TKey> extends BaseReadOnlyRepo<TEntity, T, TKey> implements IBaseRepo<T, TKey> {
  constructor(internalRepo: Repository<TEntity>, mapper: ITransmute, logger: PinoLogger, entityType: Type<TEntity>, domainType: Type<T>) {
    super(internalRepo, mapper, logger, entityType, domainType);
  }

  protected get autoUpdatedAtEnabled(): boolean {
    return true;
  }

  public async createAsync(entry: T): Promise<T> {
    try {
      const entity = this.mapToEntity(entry);
      await this.internalRepo.save(entity);
      return this.mapToModel(entity);
    } catch (ex) {
      this.logger.error(ex);
      throw new DbException(ex);
    }
  }

  public async updateAsync(entry: T): Promise<T> {
    try {
      const entity: TEntity = this.mapToEntity(entry);
      if (includes(keys(entity), 'updatedAt') && this.autoUpdatedAtEnabled) {
        (entity as Record<string, any>)['updatedAt'] = new Date();
      }
      await this.internalRepo.save(entity);
      return this.mapToModel(entity);
    } catch (ex) {
      this.logger.error(ex);
      throw new DbException(ex);
    }
  }

  protected mapToEntity(entry: T): TEntity {
    return this.internalRepo.create(entry as unknown as TEntity);
  }
}
