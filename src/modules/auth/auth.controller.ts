import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto, UserRegisterDto } from './dto/index';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: UserLoginDto): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(
      dto.email,
      dto.password,
    );
    return this.authService.login(user);
  }

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
  @HttpCode(HttpStatus.OK)
  @Post('password')
  async forgottenPassword(@Body() dto: UserLoginDto): Promise<{ reset_token: string }> {
    return this.authService.forgottenPassword(dto.email);
  }
    */
}
