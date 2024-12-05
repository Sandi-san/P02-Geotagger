import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto, UserRegisterDto, UserEmailDto, UserPasswordDto } from './dto/index';
import { UpdateUserDto } from '../user/dto/user-update.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /*
  LOGIN AS USER
  */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: UserLoginDto): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(
      dto.email,
      dto.password,
    );
    return this.authService.login(user);
  }

  /*
  CREATE NEW USER
  */
  //TODO: upload image
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() dto: UserRegisterDto): Promise<{ access_token: string }> {
    //register
    const user = await this.authService.register(dto);
    //with register data, create UserLoginDto
    const user_dto: UserLoginDto = {
      email: user.email,
      password: dto.password
    }
    //immediately login user and return access token (prevents another login after register)
    return this.login(user_dto);
  }

  /*
  SEND RESET TOKEN TO EMAIL
  */
  @HttpCode(HttpStatus.OK)
  @Post('forgotten-password')
  //TODO: rate-limit to prevent abuse/overuse
  async forgottenPassword(@Body() dto: UserEmailDto): Promise<{ response: string }> {
    console.log(dto)
    return this.authService.forgottenPassword(dto.email);
  }

  /*
  RESET PASSWORD WITH RESET TOKEN
  */
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() dto: UpdateUserDto): Promise<{ response: string }> {
    console.log(dto)
    return this.authService.resetPassword(dto);
  }
}
