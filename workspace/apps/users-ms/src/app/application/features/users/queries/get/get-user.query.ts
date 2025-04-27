import { AutoMap } from '@automapper/classes';
import { QueryBase } from '@vanguard-nx/core';

export class GetUserQuery extends QueryBase {
  @AutoMap()
  public id: string;
}
