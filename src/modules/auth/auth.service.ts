import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtPayloadDto, UserRegisterDto, UserPayloadDto, UserPasswordDto } from './dto/index';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/library/MailService';
import { UpdateUserDto } from '../user/dto/user-update.dto';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/common/constants/env-vars.contant';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService
  ) { }

  async register(dto: UserRegisterDto) {
    const { email, firstName, lastName, password } = dto

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      throw new BadRequestException(`${email} is already taken!`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const { password: pw, ...savedUser } = await this.prisma.user.create(
        {
          data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
          }
        });

      return savedUser;
    }
    catch (error) {
      Logger.error(error);
      throw new BadRequestException(
        'Something went wrong while registering user!',
      )
    }
  }

  async login(user: UserPayloadDto): Promise<{ access_token: string }> {
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
        select: { id: true, email: true, password: true }
      }
    );
    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found!`);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Passwords do not match!');
    }
    //do not return password to prevent data leak
    delete user.password;

    return user;
  }

  async forgottenPassword(email: string): Promise<{ response: string }> {
    const user = await this.prisma.user.findFirst(
      {
        where: { email },
        select: { id: true }
      }
    )
    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }

    //generate reset token and expiry time for 1h
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000)

    console.log(`Token: ${resetToken} Expiry: ${resetTokenExpiry}`)

    //save to database
    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry
        }
      })
    }
    catch (error) {
      Logger.error(error);
      throw new BadRequestException(
        'Something went wrong while updating user\'s reset token!',
      );
    }

    try {
      await this.mailService.sendPasswordResetRequest(email, resetToken)
    }
    catch (error) {
      Logger.error(error);
      throw new BadRequestException(
        `Something went wrong while sending email to ${email}!`,
      );
    }

    return { response: `Reset token has been sent to: ${email}` }
  }

  async resetPassword(dto: UpdateUserDto): Promise<{ response: string }> {
    const { resetToken, password, confirm_password } = dto

    const user = await this.prisma.user.findFirst({
      where: { resetToken },
      select: { id: true, password: true, resetTokenExpiry: true }
    })
    if (!user || new Date() > user.resetTokenExpiry)
      throw new BadRequestException('Invalid or expired reset token!');

    if (password && confirm_password) {
      //check new password
      if (password != confirm_password)
        throw new BadRequestException('Password and confirm password do not match!')
      const pwMatch = await bcrypt.compare(password, user.password);
      if (pwMatch)
        throw new BadRequestException('New password cannot be same as old password!')

      //save new password
      const newPashHash = await bcrypt.hash(password, 10);
      try {
        //if successful, change password and clear reset token
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            password: newPashHash,
            resetToken: null,
            resetTokenExpiry: null
          }
        });

        return { response: 'Password changed successfully!' }

      }
      catch (error) {
        Logger.error(error);
        throw new BadRequestException(
          'Something went wrong while updating user password!',
        )
      }
    }
    throw new BadRequestException('Please input and confirm new password!');
  }


  async googleLogin(user) {
    const { email, firstName, lastName, image } = user

    console.log("User data: ", user)

    let existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      try {
        Logger.log("OAuth User does not exist in database. Creating new.")
        
        existingUser = await this.prisma.user.create(
          {
            data: {
              firstName,
              lastName,
              email,
              image,
              password: null, // OAuth users won't have password
            }
          });
      }
      catch (error) {
        Logger.error(error);
        throw new BadRequestException(
          'Something went wrong while creating user with OAuth data!',
        )
      }
    }
    
    Logger.log("Logging in OAuth User.")
    return this.login(existingUser);
  }

}
