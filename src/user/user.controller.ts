import { Controller, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { GetLoggedUser } from 'src/modules/auth/decorator/get-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@ApiBearerAuth('access-token') //so Swagger can input Authorization into request
//restrict routes
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    
    @HttpCode(HttpStatus.OK)
    @Get('')
    async get(
        //get validated user object (request.user)
       @GetLoggedUser() user: User,
    ): Promise<User>{
        //return entire user object (@GetLoggedUser('email') for email)
        return user;
    }
        /*
    @UseGuards(JwtAuthGuard)
    @Get('')
    async get(
    ){
        return {message: 'Protected route.'}
    }*/

    @HttpCode(HttpStatus.OK)
    @Patch('')
    async update(){

    }
}
