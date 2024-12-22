import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
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
                'Something went wrong while searching for paginated locations!',
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
            const guessTokens = user.guessTokens + 10
            user.guessTokens = user.guessTokens + 10
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

    async getNumGuessesOfLocation(locationId: number, userId: number): Promise<number> {
        try {
            const guesses = await this.prisma.guess.findMany({
                where: {
                    locationId,
                    userId
                }
            })
            return guesses.length
        }
        catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025')
                    throw new BadRequestException(`Location id ${locationId} or user id ${userId} is invalid!`);
            } else {
                Logger.error(error);
                throw new BadRequestException(
                    `Something went wrong while fetching guesses from location with id ${locationId} and user with id ${userId}!`,
                );
            }
        }
    }

    async guess(locationId: number, user: User, dto: CreateGuessDto): Promise<Guess> {
        let tokensNeeded = 1

        //count how many guesses user has made on specific location
        const numGuesses = await this.getNumGuessesOfLocation(locationId, user.id)
        //first guess - 1 token, second - 2 tokens, third and onward - 3 tokens
        if (numGuesses == 1)
            tokensNeeded = 2
        else if (numGuesses >= 2)
            tokensNeeded = 3

        if (user.guessTokens <= tokensNeeded)
            throw new ForbiddenException(`Invalid number of tokens remaining: ${user.guessTokens} \n Number of tokens required for a guess on this location: ${tokensNeeded}`)

        //console.log(`Guesses: ${numGuesses} Tokens: ${user.guessTokens} Needed: ${tokensNeeded}`)

        return await this.prisma.$transaction(async () => {
            //decrement guessTokens from user
            const guessTokens = user.guessTokens - tokensNeeded
            user.guessTokens = user.guessTokens - tokensNeeded
            await this.userService.update(user.id, { guessTokens })
            //create guess
            return await this.guessService.create(locationId, user.id, dto)
        })
    }

    async getGuesses(locationId: number): Promise<Guess[]> {
        return await this.guessService.getForLocation(locationId)
    }
}
