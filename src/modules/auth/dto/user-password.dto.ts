import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

//dto for resetting password for user
export class UserPasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsString()
  resetToken: string;
}
