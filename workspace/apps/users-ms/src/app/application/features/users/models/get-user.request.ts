import { AutoMap } from '@vanguard-nx/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetUserRequest {
  @ApiProperty({ description: 'User Id' })
  @IsNotEmpty()
  @IsUUID()
  @AutoMap()
  public id: string;
}
