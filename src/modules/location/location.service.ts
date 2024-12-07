import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Guess, Location, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLocationDto, UpdateLocationDto } from './dto';
import { CreateGuessDto } from '../guess/dto/guess-create.dto';
import { GuessService } from '../guess/guess.service';
import { UserService } from '../user/user.service';

@Injectable()
export class LocationService {
    constructor(
        private prisma: PrismaService,
        private guessService: GuessService,
        private userService: UserService
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

    async create(user: User, createLocationDto: CreateLocationDto): Promise<Location> {
        //transaction: Update User, Create Location
        return await this.prisma.$transaction(async () => {
            const userId = user.id
            //increment guessTokens from user
            const guessTokens = user.guessTokens + 1
            user.guessTokens = user.guessTokens + 1
            await this.userService.update(userId, { guessTokens })

            //create location
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
        })
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

    async guess(locationId: number, user: User, dto: CreateGuessDto): Promise<Guess> {
        return await this.prisma.$transaction(async () => {
            //decrement guessTokens from user
            const guessTokens = user.guessTokens - 1
            user.guessTokens = user.guessTokens - 1
            await this.userService.update(user.id, { guessTokens })
            //create guess
            return await this.guessService.create(locationId, user.id, dto)
        })
    }
}
