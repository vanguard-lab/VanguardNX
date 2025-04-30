import { IQueryHandler } from '@nestjs/cqrs';
import { QueryHandlerStrict } from '@vanguard-nx/core';
import { User } from '../../domain';
import { GetUserQuery } from './get-user.query';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@QueryHandlerStrict(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery, User> {
  constructor(@InjectPinoLogger(GetUserQueryHandler.name) private logger: PinoLogger) {}

  public async execute(query: GetUserQuery): Promise<User> {
    this.logger.info(`Executing Query "${GetUserQueryHandler.name}"`);

    const usr = new User();
    usr.username = 'API_ACE';
    usr.id = query.id;
    usr.test = 'This should not be included in response';

    return usr;
  }
}
