import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { LocationService } from './location.service';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { Location } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt';
import { CreateLocationDto, UpdateLocationDto } from './dto';
import { GetLoggedUser } from '../auth/decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveImageToStorage } from 'src/common/helpers/image-storage.helper';
import { saveImageLocally } from 'src/common/middleware/image-storage.middleware';

@ApiTags('location')
@Controller('location')
export class LocationController {
    constructor(private locationService: LocationService) {}

    /*
    GET LOCATIONS (PAGINATED)
    */
    @HttpCode(HttpStatus.OK)
    @Get('')
    async getPaginate(@Query('page') page: number): Promise<PaginatedResult> {
        return this.locationService.getPaginate(page)
    }

    /*
    GET LOCATION BY ID
    */
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async getById(@Param('id', ParseIntPipe) id: number): Promise<Location>{
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
        @GetLoggedUser('id') id: number,
        @Body() dto: CreateLocationDto
    ): Promise<Location> {
        //TODO: add image on creation
        return this.locationService.create(id,dto)
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
    ): Promise<Location>{
        return this.locationService.update(id,dto)
    }

    /*
    UPDATE LOCATION IMAGE
    */
    @HttpCode(HttpStatus.OK)
    @Post('update-image/:id')
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
    @UseInterceptors(FileInterceptor('image', saveImageToStorage))
    async updateImage(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File
    ): Promise<Location> {
        Logger.log(file);
        console.log(file)
        //call method that saves image file in /files folder    
        const filename = await saveImageLocally(file)
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
    ): Promise<{ response: string }>{
        return this.locationService.delete(id)
    }
}
