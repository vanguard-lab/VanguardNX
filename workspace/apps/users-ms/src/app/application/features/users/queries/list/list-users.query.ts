import { AutoMap, QueryBase } from '@vanguard-nx/core';

export class ListUsersQuery extends QueryBase {
  // there is no filters as of now!
  @AutoMap()
  public email: string;

  @AutoMap()
  public username: string;
}
