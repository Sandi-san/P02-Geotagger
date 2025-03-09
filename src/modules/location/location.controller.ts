import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, HttpStatus, Logger, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { LocationService } from './location.service';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { Guess, Location, User } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt';
import { CreateLocationDto, UpdateLocationDto } from './dto';
import { GetLoggedUser } from '../auth/decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImageToStorage } from 'src/common/helpers/local-image-storage.helper';
import { saveImageLocally } from 'src/common/middleware/local-image-storage.middleware';
import { CreateGuessDto } from '../guess/dto/guess-create.dto';
import { uploadImageToS3 } from 'src/common/middleware/remote-image-storage.middleware';
import { saveImageToRemote } from 'src/common/helpers/remote-image-storage.helper';

@ApiTags('location')
@Controller('location')
export class LocationController {
    constructor(private locationService: LocationService) { }

    /*
    GET LOCATIONS (PAGINATED)
    */
    @HttpCode(HttpStatus.OK)
    @Get('')
    async getPaginate(
        @Query('page') page?: string,
        @Query('take') take?: string,
    ): Promise<PaginatedResult> {
        //if page/take is not passed or cannot be parsed, use default value
        const pageParsed = parseInt(page, 10) || 1
        const takeParsed = parseInt(take, 10) || 9
        // console.log(`Locations: Page: ${page}, Take: ${take}`)
        return this.locationService.getPaginate(pageParsed, takeParsed)
    }

    /*
    GET LOCATION BY ID
    */
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<Location> {
        return this.locationService.getById(id)
    }

    /*
    CREATE LOCATION WITH LOGGED USER
    */
    @HttpCode(HttpStatus.CREATED)
    @Post('')
    //restricted route (needs to be logged in)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    async create(
        @GetLoggedUser('') user: User,
        @Body() dto: CreateLocationDto
    ): Promise<Location> {
        return this.locationService.create(user, dto)
    }

    /*
    UPDATE LOCATION DATA
    */
    @HttpCode(HttpStatus.OK)
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateLocationDto
    ): Promise<Location> {
        return this.locationService.update(id, dto)
    }

    /*
    UPDATE LOCATION IMAGE
    */
    @HttpCode(HttpStatus.OK)
    @Post(':id/update-image')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
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
    // @UseInterceptors(FileInterceptor('image', saveImageToStorage)) //local
    @UseInterceptors(FileInterceptor('image', saveImageToRemote)) //remote
    async updateImage(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File
    ): Promise<Location> {
        Logger.log(file);
        //console.log(file)
        
        //call method that saves image file
        const filename = await saveImageLocally(file) //locally in /files
        // const filename = await uploadImageToS3(file) //upload to AWS S3 bucket (remote)
        return this.locationService.updateImage(id, filename);
    }

    /*
    DELETE LOCATION
    */
    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    async delete(
        @Param('id', ParseIntPipe) id: number
    ): Promise<{ response: string }> {
        return this.locationService.delete(id)
    }


    /*
    CREATE GUESS ON LOCATION WITH LOGGED USER
    */
    @HttpCode(HttpStatus.CREATED)
    @Post(':id/guess')
    //restricted route (needs to be logged in)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('access-token')
    async guess(
        @Param('id', ParseIntPipe) locationId: number,
        @GetLoggedUser('') user: User,
        @Body() dto: CreateGuessDto
    ): Promise<Guess> {
        if (user.guessTokens <= 0)
            throw new ForbiddenException(`Invalid number of tokens remaining: ${user.guessTokens}`)
        return this.locationService.guess(locationId, user, dto)
    }

    /*
    GET GUESSES FROM LOCATION WITH LOGGED USER
    */
    @HttpCode(HttpStatus.OK)
    @Get(':id/guesses')
    @ApiBearerAuth('access-token')
    async getGuesses(
        @Param('id', ParseIntPipe) locationId: number
    ): Promise<Guess[]> {
        return this.locationService.getGuesses(locationId)
    }
}
