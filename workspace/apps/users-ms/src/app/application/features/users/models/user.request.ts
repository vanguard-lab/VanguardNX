import { AutoMap } from '@vanguard-nx/core';

export class UserRequest {
  @AutoMap()
  public email: string;

  @AutoMap()
  public id: string;

  @AutoMap()
  public username: string;

  @AutoMap(() => Date)
  public createdAt: Date;
}
