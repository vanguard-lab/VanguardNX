import { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandlerStrict } from '@vanguard-nx/core';
import { AddUserCommand } from './add-user.command';
import { Inject } from '@nestjs/common';
import { IUserRepo, USER_REPO } from '../../repositories';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { User } from '../../domain';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

@CommandHandlerStrict(AddUserCommand)
export class AddUserCommandHandler implements ICommandHandler<AddUserCommand, User> {
  constructor(
    @Inject(USER_REPO) protected readonly repo: IUserRepo,
    @InjectMapper() protected readonly mapper: Mapper,
    @InjectPinoLogger(AddUserCommandHandler.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: AddUserCommand): Promise<User> {
    this.logger.info(`Executing Query "${AddUserCommandHandler.name}"`);
    const user = this.mapper.map(command, AddUserCommand, User);
    return this.repo.createAsync(user);
  }
}
