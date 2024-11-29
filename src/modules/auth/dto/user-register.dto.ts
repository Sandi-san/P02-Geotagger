import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName: string;
  
  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;
  
  @ApiProperty()
  @IsString()
  @IsEmail()
  @MinLength(4)
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  //TODO
  //image: string;
}
