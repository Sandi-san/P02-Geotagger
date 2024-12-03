import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

//dto for inputting Email only - for resetting password for user
export class UserEmailDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  email: string;
}
