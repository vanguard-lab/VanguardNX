import { AutoMap, CommandBase } from '@vanguard-nx/core';

export class AddUserCommand extends CommandBase {
  @AutoMap()
  public email: string;

  @AutoMap()
  public username: string;
}
