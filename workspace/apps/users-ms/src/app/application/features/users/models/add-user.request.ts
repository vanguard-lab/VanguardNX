import { AutoMap } from '@vanguard-nx/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';
import { USER_NAME_MAX_LEN } from '../../../constants';

export class AddUserRequest {
  @ApiProperty({ description: 'user Name' })
  @IsString()
  @MaxLength(USER_NAME_MAX_LEN)
  @AutoMap()
  public username: string;

  @ApiProperty({ description: 'User Email' })
  @IsEmail()
  @AutoMap()
  public email: string;
}
