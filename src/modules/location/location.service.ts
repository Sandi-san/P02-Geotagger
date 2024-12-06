import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Location } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLocationDto, UpdateLocationDto } from './dto';

@Injectable()
export class LocationService {
    constructor(
        private prisma: PrismaService
    ) { }

    async getPaginate(page = 1, relations = []): Promise<PaginatedResult> {
        //max number to display on one page
        const take = 9
        try {
            //get paginated locations
            const data = await this.prisma.location.findMany({
                take,
                skip: (page - 1) * take, //calculate which pages to return
                orderBy: {
                    createdAt: 'asc',
                }
            })

            //count the amount of returned entities
            const total = await this.prisma.location.count()

            //return structured data
            return {
                data,
                meta: {
                    total,
                    page,
                    last_page: Math.ceil(total / take)
                }
            }
        }
        catch (error) {
            throw new InternalServerErrorException(
                'Something went wrong while searching for paginated elements',
            )
        }
    }

    async getById(id: number): Promise<Location> {
        try {
            const location = await this.prisma.location.findFirstOrThrow({
                where: { id }
            })
            return location
        }
        catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                //Prisma error code for NotFound
                if (error.code = 'P2025') {
                    Logger.error(`Location of id: ${id} was not found!`)
                    throw new NotFoundException(`Location of id: ${id} was not found!`)
                }
            }
            else {
                Logger.error(error);
                throw new BadRequestException(
                    'Something went wrong while fetching location!',
                );
            }
        }
    }

    async create(userId: number, createLocationDto: CreateLocationDto): Promise<Location> {
        try {
            const dto = {
                ...createLocationDto,
                userId
            }
            const location = await this.prisma.location.create({
                data: {
                    ...dto
                }
            })
            return location
        }
        catch (error) {
            Logger.log(error);
            throw new BadRequestException(
                'Something went wrong while creating new location!',
            );
        }
    }

    async update(id: number, updateLocationDto: UpdateLocationDto): Promise<Location> {
        try {
            const updatedLocation = await this.prisma.location.update({
                where: { id },
                data: {
                    ...updateLocationDto
                },
            });
            return updatedLocation;
        } catch (error) {
            //check prisma errors
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025')
                    throw new BadRequestException(`Id ${id} is invalid!`);
            } else {
                Logger.error(error);
                throw new BadRequestException(
                    'Something went wrong while updating location!',
                );
            }
        }
    }

    async updateImage(id: number, image: string): Promise<Location> {
        //call location update with only image string
        return this.update(id, { image });
    }

    async delete(id: number): Promise<{ response: string }> {
        try {
            await this.prisma.location.delete({
                where: { id },
            });
            return { response: 'Location deleted successfully' }
        } catch (error) {
            //check prisma errors
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025')
                    throw new BadRequestException(`Id ${id} is invalid!`);
            } else {
                Logger.error(error);
                throw new BadRequestException(
                    'Something went wrong while deleting location!',
                );
            }
        }
    }
}
