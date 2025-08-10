import { AutoMap } from '@vanguard-nx/core';

export class User {
  @AutoMap()
  public email: string;

  @AutoMap()
  public id: string;

  @AutoMap()
  public username: string;
}
