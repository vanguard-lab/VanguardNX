import { ForbiddenException, Inject } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { QueryHandlerStrict } from '@vanguard-nx/core';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { User } from '../../domain';
import { IUserAbacService, USER_ABAC_SERVICE } from '../../policies';
import { IUserRepo, USER_REPO } from '../../repositories';
import { ListUsersQuery } from './list-users.query';

@QueryHandlerStrict(ListUsersQuery)
export class ListUsersQueryHandler implements IQueryHandler<ListUsersQuery, User[]> {
  constructor(
    @Inject(USER_REPO) protected readonly repo: IUserRepo,
    @Inject(USER_ABAC_SERVICE) protected readonly abacService: IUserAbacService,
    @InjectPinoLogger(ListUsersQueryHandler.name) protected readonly logger: PinoLogger,
  ) {}

  public async execute(_query: ListUsersQuery): Promise<User[]> {
    this.logger.info(`Executing Query "${ListUsersQuery.name}"`);

    const demoActor = this.abacService.buildDummyActor('demo-user-id');

    const r = await this.abacService.canListUsers(demoActor, { testId: 'this is an invalid value, but it will be transformed!' });
    if (!r) {
      // will never happen in this demo, but just to show how to handle forbidden access
      throw new ForbiddenException(`Access denied to user list`);
    }

    const res = await this.repo.listUsersAsync();

    return res;
  }
}
