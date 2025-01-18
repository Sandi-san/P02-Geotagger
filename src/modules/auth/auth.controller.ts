import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto, UserRegisterDto, UserEmailDto, UserPasswordDto } from './dto/index';
import { UpdateUserDto } from '../user/dto/user-update.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RateLimiterService } from 'src/library/RateLimiter';
import { EnvVars } from 'src/common/constants/env-vars.contant';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private rateLimiterService: RateLimiterService,
    private configService: ConfigService
  ) { }

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
  async forgottenPassword(@Body() dto: UserEmailDto): Promise<{ response: string }> {
    //console.log(dto)
    if (!this.rateLimiterService.isAllowed(dto.email)) {
      throw new BadRequestException(
        'Too many requests. Please wait a while before trying again.',
      )
    }
    return this.authService.forgottenPassword(dto.email);
  }

  /*
  RESET PASSWORD WITH RESET TOKEN
  */
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() dto: UpdateUserDto): Promise<{ response: string }> {
    //console.log(dto)
    return this.authService.resetPassword(dto);
  }

  /*
  ROUTE THAT CALLS THE GOOGLE OAUTH CHOOSE ACCOUNT PAGE
  */
  @ApiOperation({ summary: 'Unusable with Swagger' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleRedirect() { }

  /*
  ROUTE THAT GETS CALLED WHEN THE USER SENDS THEIR GOOGLE DATA
  */
  @ApiOperation({ summary: 'Unusable with Swagger' })
  @HttpCode(HttpStatus.OK)
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req, @Res() res): Promise<void> {
    //register/login with OAuth
    const { access_token } = await this.authService.googleLogin(req.user)
    //get access_token and then redirect user back to the frontend app
    res.redirect(`${this.configService.get(EnvVars.FRONTEND_DOMAIN)}/oauth/callback?access_token=${access_token}`)
  }
}
