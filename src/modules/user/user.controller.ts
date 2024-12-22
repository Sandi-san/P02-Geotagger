import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/index';
import { UserService } from './user.service';
import { User, UserAction } from '@prisma/client';
import { GetLoggedUser } from 'src/modules/auth/decorator/index';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto, CreateUserActionDto } from './dto/index';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImageToStorage } from 'src/common/helpers/image-storage.helper';
import { saveImageLocally } from 'src/common/middleware/image-storage.middleware';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@ApiTags('user')
//so Swagger can input Authorization into request
@ApiBearerAuth('access-token')
//restricted route
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    /*
    GET LOGGED USER
    */
    @HttpCode(HttpStatus.OK)
    @Get('')
    async get(
        //get validated user object (request.user)
        @GetLoggedUser() user: User,
    ): Promise<User> {
        //return entire user object (or @GetLoggedUser('email') for email)
        return user;
    }

    /*
    UPDATE USER (SELF)
    */
    @HttpCode(HttpStatus.OK)
    @Patch('update')
    async update(
        @GetLoggedUser('id') id: number,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<User> {
        return this.userService.update(id, updateUserDto);
    }

    /*
    UPDATE USER PASSWORD (SELF)
    */
    @HttpCode(HttpStatus.OK)
    @Patch('update-password')
    async updatePassword(
        @GetLoggedUser('id') id: number,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<{ response: string }> {
        return this.userService.updatePassword(id, updateUserDto);
    }

    /*
    UPDATE USER IMAGE (SELF)
    */
    @HttpCode(HttpStatus.OK)
    @Post('update-image')
    //For Swagger:
    @ApiConsumes('multipart/form-data') //endpoint accepts files
    @ApiBody({     //define body
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary', //show file input in Swagger
                },
            },
        },
    })
    //'image' must have same name as 'id' in frontend
    @UseInterceptors(FileInterceptor('image', saveImageToStorage))
    async updateImage(
        @GetLoggedUser('id') id: number,
        @UploadedFile() file: Express.Multer.File
    ): Promise<User> {
        Logger.log(file);
        //console.log(file)
        //call method that saves image file in /files folder    
        const filename = await saveImageLocally(file)
        return this.userService.updateImage(id, filename);
    }

    /*
    GET LOCATIONS MADE BY USER
    */
    @HttpCode(HttpStatus.OK)
    @Get('locations')
    async getLocations(
        @GetLoggedUser('id') id: number
    ): Promise<PaginatedResult> {
        return this.userService.getLocations(id);
    }

    /*
    GET GUESSES MADE BY USER
    */
    @HttpCode(HttpStatus.OK)
    @Get('guesses')
    async getGuesses(
        @GetLoggedUser('id') id: number
    ): Promise<PaginatedResult> {
        return this.userService.getGuesses(id);
    }


    /*
    SAVE USER ACTIONS
    */
    @HttpCode(HttpStatus.CREATED)
    @Post('actions')
    async saveActions(
        @GetLoggedUser('id') id: number,
        @Body() dto: CreateUserActionDto
    ): Promise<{ response: string }> {
        return this.userService.saveActions(id,dto)
    }
    
    /*
    GET LAST 100 ACTIONS FROM DB
    */
    @HttpCode(HttpStatus.OK)
    @Get('actions')
    async getActions(
        @Query('take') take = 100
    ): Promise<UserAction[]> {
        //TODO: check if user is admin?
        return this.userService.getActions(take)
    }
}
