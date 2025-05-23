import { AutoMap } from '@automapper/classes';

export class User {
  @AutoMap()
  public id: string;

  @AutoMap()
  public username: string;

  @AutoMap()
  public email: string;
}
