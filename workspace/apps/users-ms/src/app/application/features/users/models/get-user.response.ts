import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { UserTinyResponse } from './user-tiny.response';

export class GetUserResponse extends UserTinyResponse {
  @ApiProperty({ description: 'User Email', required: true })
  @AutoMap()
  public email: string;
}
