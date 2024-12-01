import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName: string;
  
  @ApiPropertyOptional()
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
