import { Inject } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandlerStrict, InjectMapper, ITransmute } from '@vanguard-nx/core';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { User } from '../../domain';
import { IUserRepo, USER_REPO } from '../../repositories';
import { AddUserCommand } from './add-user.command';

@CommandHandlerStrict(AddUserCommand)
export class AddUserCommandHandler implements ICommandHandler<AddUserCommand, User> {
  constructor(
    @Inject(USER_REPO) protected readonly repo: IUserRepo,
    @InjectMapper() protected readonly mapper: ITransmute,
    @InjectPinoLogger(AddUserCommandHandler.name)
    private readonly logger: PinoLogger,
  ) {}

  public async execute(command: AddUserCommand): Promise<User> {
    this.logger.info(`Executing Query "${AddUserCommandHandler.name}"`);
    const user = this.mapper.map(command, AddUserCommand, User);
    return this.repo.createAsync(user);
  }
}
