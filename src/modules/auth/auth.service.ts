import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayloadDto, UserRegisterDto } from './dto/index';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserPayloadDto } from './dto/user-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    //@InjectRepository(User)
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async register(dto: UserRegisterDto) {
    const email = dto.email
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (user) {
      throw new BadRequestException(`${email} is already taken`);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const { password: pw, ...savedUser } = await this.prisma.user.create(
      {
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email,
          password: hashedPassword,
        }
      });

    return savedUser;
  }

  async login(user: UserPayloadDto) {
    const payload: JwtPayloadDto =
    {
      sub: user.id,
      username: user.email
    };
    return {
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findFirst(
      {
        where: { email },
        //return fields of id, email, password
        select: {id: true, email: true, password: true}
      }
    );

    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Passwords do not match');
    }

    delete user.password;

    return user;
  }
}
