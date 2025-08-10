import { ApiProperty } from '@nestjs/swagger';
import { UserTinyResponse } from './user-tiny.response';
import { AutoMap } from '@vanguard-nx/core';

export class GetUserResponse extends UserTinyResponse {
  @ApiProperty({ description: 'User Email', required: true })
  @AutoMap()
  public email: string;
}
