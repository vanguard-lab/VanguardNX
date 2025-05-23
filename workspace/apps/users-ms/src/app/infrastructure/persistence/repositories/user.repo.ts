import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepo, DbException } from '@vanguard-nx/core';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';

import { UserEntity } from '../entities';
import { IUserRepo, User } from '../../../application';

/**
 * UsersRepository
 *
 * TypeORM-backed implementation of IUsersRepository.
 * Executes actual DB operations using injected repository.
 *
 * Handles domain entities only — no DTOs or controller bindings allowed.
 *
 * @implements IUsersRepository
 * @see IUsersRepository
 */
export class UserRepo extends BaseRepo<UserEntity, User, string> implements IUserRepo {
  constructor(@InjectRepository(UserEntity) protected repo: Repository<UserEntity>, @InjectMapper() mapper: Mapper, @InjectPinoLogger(UserRepo.name) logger: PinoLogger) {
    super(repo, mapper, logger, UserEntity, User);
  }

  public async listUsersAsync(): Promise<User[]> {
    try {
      const e = await this.internalRepo.find();
      return this.mapToModelArray(e);
    } catch (ex) {
      this.logger.error(ex);
      throw new DbException(ex);
    }
  }
}
