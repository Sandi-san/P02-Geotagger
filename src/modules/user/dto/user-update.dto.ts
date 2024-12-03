import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Match } from 'src/modules/auth/decorator';

//data structure for updating User
export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  //frontend sends old_password
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  old_password?: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => typeof o.password === 'string' && o.password.length > 0)
  @IsOptional()
  @IsString()
  @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      'Password must contain one number, one uppercase or lowercase letter and has to be longer than 5 characters!',
  })
  password?: string;

  @ApiPropertyOptional()
  @ValidateIf((o) => typeof o.confirm_password === 'string' && o.confirm_password.length > 0)
  @IsOptional()
  @IsString()
  //custom decorator ()
  @Match(UpdateUserDto, (field) => field.password, {
    message: 'New passwords must match!',
  })
  confirm_password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  resetToken?: string

  @ApiPropertyOptional()
  @IsOptional()
  image?: string;

  //guessTokens
  //role
}