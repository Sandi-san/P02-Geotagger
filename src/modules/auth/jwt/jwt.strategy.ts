import { EnvVars } from './../../../common/constants/env-vars.contant';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayloadDto } from '../dto/index';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      //JWT_SECRET as key from .env
      secretOrKey: configService.get(EnvVars.JWT_SECRET),
      //secretOrKey: process.env.JWT_SECRET,
    });
  }

  //validate token - called on AuthGuard('jwt')
  async validate(payload: JwtPayloadDto) {
    return await this.prisma.user.findUniqueOrThrow(
      {where: {id: payload.sub} });
  }
}
