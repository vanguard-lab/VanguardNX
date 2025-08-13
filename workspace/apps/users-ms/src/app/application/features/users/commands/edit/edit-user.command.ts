import { AutoMap, CommandBase } from '@vanguard-nx/core';

export class EditUserCommand extends CommandBase {
  @AutoMap()
  public id: string;

  @AutoMap()
  public email: string;

  @AutoMap()
  public username: string;
}
