import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Patch, Post, Query, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/index';
import { UserService } from './user.service';
import { User, UserAction } from '@prisma/client';
import { GetLoggedUser } from 'src/modules/auth/decorator/index';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto, CreateUserActionDto } from './dto/index';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImageToStorage } from 'src/common/helpers/local-image-storage.helper';
import { saveImageLocally } from 'src/common/middleware/local-image-storage.middleware';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { uploadImageToS3 } from 'src/common/middleware/remote-image-storage.middleware';
import { saveImageToRemote } from 'src/common/helpers/remote-image-storage.helper';

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
    @UseInterceptors(FileInterceptor('image', saveImageToStorage)) //local
    // @UseInterceptors(FileInterceptor('image', saveImageToRemote)) //remote
    async updateImage(
        @GetLoggedUser('') user: User,
        @UploadedFile() file: Express.Multer.File
    ): Promise<User> {
        Logger.log(file);
        //console.log(file)
        
        //call method that saves image file
        const filename = await saveImageLocally(file, user.image) //locally in /files
        // const filename = await uploadImageToS3(file) //upload to AWS S3 bucket (remote)
        return this.userService.updateImage(user.id, filename);
    }

    /*
    GET LOCATIONS MADE BY USER
    */
    @HttpCode(HttpStatus.OK)
    @Get('locations')
    async getLocations(
        @GetLoggedUser('id') id: number,
        @Query('page') page?: string,
        @Query('take') take?: string,
    ): Promise<PaginatedResult> {
        //if page/take is not passed or cannot be parsed, use default value
        const pageParsed = parseInt(page, 10) || 1
        const takeParsed = parseInt(take, 10) || 4
        // console.log(`Location: Page: ${page}, Take: ${take}`)
        return this.userService.getLocations(id, pageParsed, takeParsed);
    }

    /*
    GET GUESSES MADE BY USER
    */
    @HttpCode(HttpStatus.OK)
    @Get('guesses')
    async getGuesses(
        @GetLoggedUser('id') id: number,
        @Query('page') page?: string,
        @Query('take') take?: string,
    ): Promise<PaginatedResult> {
        //if page/take is not passed or cannot be parsed, use default value
        const pageParsed = parseInt(page, 10) || 1
        const takeParsed = parseInt(take, 10) || 4
        // console.log(`Location: Page: ${page}, Take: ${take}`)
        return this.userService.getGuesses(id, pageParsed, takeParsed);
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
        return this.userService.saveActions(id, dto)
    }

    /*
    GET LAST 100 ACTIONS FROM DB
    */
    @HttpCode(HttpStatus.OK)
    @Get('actions')
    async getActions(
        @GetLoggedUser('role') role: string,
        @Query('take') take = 100
    ): Promise<UserAction[]> {
        if (role !== "admin")
            throw new UnauthorizedException("Unauthorized access! User is not an admin!")
        return this.userService.getActions(take)
    }
}
