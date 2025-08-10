import { Inject } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { QueryHandlerStrict } from '@vanguard-nx/core';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { User } from '../../domain';
import { IUserRepo, USER_REPO } from '../../repositories';
import { ListUsersQuery } from './list-users.query';

@QueryHandlerStrict(ListUsersQuery)
export class ListUsersQueryHandler implements IQueryHandler<ListUsersQuery, User[]> {
  constructor(@Inject(USER_REPO) protected readonly repo: IUserRepo, @InjectPinoLogger(ListUsersQueryHandler.name) protected readonly logger: PinoLogger) {}

  public async execute(_query: ListUsersQuery): Promise<User[]> {
    this.logger.info(`Executing Query "${ListUsersQuery.name}"`);

    const res = await this.repo.listUsersAsync();

    return res;
  }
}
