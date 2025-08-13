import { Inject } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CommandHandlerStrict, IMapper, InjectMapper } from '@vanguard-nx/core';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { User } from '../../domain';
import { IUserRepo, USER_REPO } from '../../repositories';
import { EditUserCommand } from './edit-user.command';
import { isNilOrEmpty } from '@vanguard-nx/utils';
import { UserNotFoundException } from '../../exceptions';

@CommandHandlerStrict(EditUserCommand)
export class EditUserCommandHandler implements ICommandHandler<EditUserCommand, User> {
  constructor(
    @Inject(USER_REPO) protected readonly repo: IUserRepo,
    @InjectMapper() protected readonly mapper: IMapper,
    @InjectPinoLogger(EditUserCommandHandler.name) protected readonly logger: PinoLogger,
  ) {}

  public async execute(command: EditUserCommand): Promise<User> {
    const user = await this.repo.getAsync(command.id);

    if (isNilOrEmpty(user)) {
      throw new UserNotFoundException(`User with Id: ${command.id} not found.`);
    }
    this.mapper.mutate(command, user, EditUserCommand, User);

    await this.repo.createAsync(user);
    return user;
  }
}
