import { Inject } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { InjectMapper, ObjectMapper, QueryHandlerStrict } from '@vanguard-nx/core';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { User } from '../../domain';
import { IUserRepo, USER_REPO } from '../../repositories';
import { ListUsersQuery } from './list-users.query';
// import { InjectMapper } from '@automapper/nestjs';

@QueryHandlerStrict(ListUsersQuery)
export class ListUsersQueryHandler implements IQueryHandler<ListUsersQuery, User[]> {
  constructor(
    @Inject(USER_REPO) protected readonly repo: IUserRepo,
    @InjectMapper() protected readonly mapper: ObjectMapper,
    @InjectPinoLogger(ListUsersQueryHandler.name) protected readonly logger: PinoLogger, // private readonly customerMapper: ObjectMapper,
  ) {}

  public async execute(_query: ListUsersQuery): Promise<User[]> {
    // this.createMapping(User, ListUsersQuery);

    // const userMap = this.mapper.map(_query, ListUsersQuery, User);
    // console.log('>>>>>>>>>>>>>>>>> USERMAP', userMap);

    this.logger.info(`Executing Query "${ListUsersQuery.name}"`);

    const res = await this.repo.listUsersAsync();
    // this.debug();
    // const user = this.customerMapper.map(res[0], User, ListUsersQuery);
    const user = this.mapper.map(res[0], User, ListUsersQuery);
    console.log('DID THIS SIIIIIIIIIT WORK ???', user, res);
    return res;
  }
}
