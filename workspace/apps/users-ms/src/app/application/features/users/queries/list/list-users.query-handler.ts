import { QueryHandlerStrict } from '@vanguard-nx/core';
import { ListUsersQuery } from './list-users.query';
import { IQueryHandler } from '@nestjs/cqrs';
import { User } from '../../domain';
import { IUserRepo, USER_REPO } from '../../repositories';
import { Inject } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@QueryHandlerStrict(ListUsersQuery)
export class ListUsersQueryHandler implements IQueryHandler<ListUsersQuery, User[]> {
  constructor(@Inject(USER_REPO) protected readonly repo: IUserRepo, @InjectPinoLogger(ListUsersQueryHandler.name) protected readonly logger: PinoLogger) {}

  public async execute(_query: ListUsersQuery): Promise<User[]> {
    this.logger.info(`Executing Query "${ListUsersQuery.name}"`);

    return this.repo.listUsersAsync();
  }
}
