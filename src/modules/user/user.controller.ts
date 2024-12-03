import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Logger, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { GetLoggedUser } from 'src/modules/auth/decorator/index';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/user-update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'src/common/helpers/image-storage.helper';

@ApiTags('user')
//so Swagger can input Authorization into request
@ApiBearerAuth('access-token')
//restricted route
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

    @HttpCode(HttpStatus.OK)
    @Patch('update-password')
    async updatePassword(
        @GetLoggedUser('id') id: number,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<{ response: string }> {
        return this.userService.updatePassword(id, updateUserDto);
    }

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
        //save file locally
        Logger.log(file);
        console.log(file)
        const filename = file?.filename;
        if (!filename)
            throw new BadRequestException('File must be of type png, jpg or jpeg!');
        const imagesFolderPath = join(process.cwd(), 'files');
        const fullImagePath = join(imagesFolderPath + '/' + file.filename);
        //check if file is valid and then call update
        if (await isFileExtensionSafe(fullImagePath)) {
            return this.userService.updateUserImage(id, filename);
        }
        removeFile(fullImagePath);
        throw new BadRequestException('File is corrupted!');
    }
}
