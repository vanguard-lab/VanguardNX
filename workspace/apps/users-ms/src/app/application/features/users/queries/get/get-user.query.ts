import { AutoMap } from '@vanguard-nx/core';
import { QueryBase } from '@vanguard-nx/core';

export class GetUserQuery extends QueryBase {
  @AutoMap()
  public id: string;
}
