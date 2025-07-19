import { AutoMap as Amap } from '@automapper/classes';

import { AutoMap } from '@vanguard-nx/core';

export class User {
  @Amap()
  public email: string;

  @Amap()
  @AutoMap()
  public id: string;

  @Amap()
  @AutoMap()
  public username: string;
}
