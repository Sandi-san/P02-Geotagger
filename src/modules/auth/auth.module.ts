import { EnvVars } from './../../common/constants/env-vars.contant';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/index';
import { MailService } from 'src/library/MailService';
import { GoogleStrategy } from './oauth/google.strategy';
import { RateLimiterService } from 'src/library/RateLimiter';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(EnvVars.JWT_SECRET),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MailService, GoogleStrategy, RateLimiterService],
})
export class AuthModule { }
