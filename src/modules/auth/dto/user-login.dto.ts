import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UserLoginDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;
}