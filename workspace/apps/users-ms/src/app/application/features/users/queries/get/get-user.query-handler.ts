import { IQueryHandler } from '@nestjs/cqrs';
import { QueryHandlerStrict } from '@vanguard-nx/core';
import { User } from '../../domain';
import { GetUserQuery } from './get-user.query';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { IUserRepo, USER_REPO } from '../../repositories';
import { Inject } from '@nestjs/common';
import { isNilOrEmpty } from '@vanguard-nx/utils';
import { UserNotFoundException } from '../../exceptions';

@QueryHandlerStrict(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery, User> {
  constructor(@Inject(USER_REPO) protected readonly repo: IUserRepo, @InjectPinoLogger(GetUserQueryHandler.name) private logger: PinoLogger) {}

  public async execute(query: GetUserQuery): Promise<User> {
    this.logger.info(`Executing Query "${GetUserQuery.name}"`);

    const user = await this.repo.getAsync(query.id);

    if (isNilOrEmpty(user)) {
      throw new UserNotFoundException(`User with Id: ${query.id} not found.`);
    }

    return user!;
  }
}
