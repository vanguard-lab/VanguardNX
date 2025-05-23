import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class UserTinyResponse {
  @ApiProperty({ description: 'User Id', required: true })
  @AutoMap()
  public id: string;

  @ApiProperty({ description: 'Username', required: true })
  @AutoMap()
  public username: string;
}
