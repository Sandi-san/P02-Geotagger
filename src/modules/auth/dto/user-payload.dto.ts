import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

//UserLoginDto with id - for payload/user login
export class UserPayloadDto {
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  @MinLength(4)
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;
}
