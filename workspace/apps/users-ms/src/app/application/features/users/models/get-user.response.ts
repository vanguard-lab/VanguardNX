import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponse {
  @ApiProperty({ description: 'User Id', required: true })
  @AutoMap()
  public userId: string;

  @ApiProperty({ description: 'Username', required: true })
  @AutoMap()
  public username: string;
}
