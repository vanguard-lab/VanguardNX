import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepo } from '@vanguard-nx/core';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Repository } from 'typeorm';
import { IUserRepo, User } from '../../application/features/users';
import { UserEntity } from '../entities';

export class UserRepo extends BaseRepo<UserEntity, User, string> implements IUserRepo {
  constructor(@InjectRepository(UserEntity) protected repo: Repository<UserEntity>, @InjectMapper() mapper: Mapper, @InjectPinoLogger(UserRepo.name) logger: PinoLogger) {
    super(repo, mapper, logger, UserEntity, User);
  }
}
