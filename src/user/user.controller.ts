import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { GetLoggedUser } from 'src/modules/auth/decorator/index';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/user-update.dto';

@ApiTags('user')
//so Swagger can input Authorization into request
@ApiBearerAuth('access-token')
//restrict routes
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @HttpCode(HttpStatus.OK)
    @Get('')
    async get(
        //get validated user object (request.user)
        @GetLoggedUser() user: User,
    ): Promise<User> {
        //return entire user object (or @GetLoggedUser('email') for email)
        return user;
    }

    @HttpCode(HttpStatus.OK)
    @Patch('update')
    async update(
        @GetLoggedUser('id') id: number,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<User> {
        return this.userService.update(id, updateUserDto);
    }
}
