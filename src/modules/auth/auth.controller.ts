import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto, UserRegisterDto } from './dto/index';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: UserLoginDto) {
    const user = await this.authService.validateUser(
      dto.email,
      dto.password,
    );
    return this.authService.login(user);
  }

  //TODO: upload image
  @Post('register')
  async register(@Body() dto: UserRegisterDto) {
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
}
