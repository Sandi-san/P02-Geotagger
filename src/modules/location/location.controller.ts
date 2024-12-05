import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { Location } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt';
import { CreateLocationDto, UpdateLocationDto } from './dto';
import { GetLoggedUser } from '../auth/decorator';

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
}
