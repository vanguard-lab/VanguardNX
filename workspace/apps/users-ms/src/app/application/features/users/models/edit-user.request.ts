import { ApiProperty } from '@nestjs/swagger';
import { AddUserRequest } from './add-user.request';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { AutoMap } from '@vanguard-nx/core';

export class EditUserRequest extends AddUserRequest {
  @ApiProperty({ description: 'User Id' })
  @IsNotEmpty()
  @IsUUID()
  @AutoMap()
  public id: string;
}
