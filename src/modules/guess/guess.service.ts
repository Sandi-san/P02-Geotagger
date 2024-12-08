import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGuessDto } from './dto/guess-create.dto';
import { Guess } from '@prisma/client';
import { LocationService } from '../location/location.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class GuessService {
    constructor(
        private prisma: PrismaService
    ) { }

    //haversine formula for calculating distance between two points on sphere
    async haversineFormula(lat1: number, lon1: number, lat2: number, lon2: number): Promise<number> {
        //convert to radians
        function toRad(x: number) {
            return (x * Math.PI) / 180
        }

        //earth radius in m
        const R = 6371e3

        const dLat = toRad(lat2 - lat1)
        const dLon = toRad(lon2 - lon1)

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const d = R * c
        //remove decimals and return
        return d >> 0
    }

    async calculateDistance(lat1: number, lon1: number, locationId: number): Promise<number> {
        var location = null
        try {
            location = await this.prisma.location.findFirstOrThrow({
                where: { id: locationId }
            })
        }
        catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code = 'P2025') {
                    Logger.error(`Location of id '${locationId}' was not found!`)
                    throw new NotFoundException(`Location of id '${locationId}' was not found!`)
                }
            }
            else {
                Logger.error(error);
                throw new BadRequestException(
                    'Something went wrong while fetching location!',
                );
            }
        }
        if (location == null) {
            Logger.error('Location is null!');
            throw new BadRequestException(
                'Something went wrong while fetching location!',
            );
        }

        return this.haversineFormula(lat1, lon1, location.lat, location.lon)
    }

    async create(locationId: number, userId: number, createGuessDto: CreateGuessDto): Promise<Guess> {
        //calculate error distance
        const errorDistance = await this.calculateDistance(createGuessDto.lat, createGuessDto.lon, locationId)

        const dto = {
            ...createGuessDto,
            errorDistance,
            locationId,
            userId,
        }

        console.log("Guess: ", dto)

        try {
            const guess = await this.prisma.guess.create({
                data: {
                    ...dto
                }
            })
            return guess
        }
        catch (error) {
            Logger.log(error);
            throw new BadRequestException(
                'Something went wrong while creating new guess!',
            );
        }
    }

    async getForLocation(locationId: number): Promise<Guess[]> {
        try {
            const bids = await this.prisma.guess.findMany({
                where: { locationId },
                include: {
                    //return User data and certain elements (excluding password)
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            image: true,
                        },
                    },
                },
                orderBy: [{
                    errorDistance: 'asc'
                },
                {
                    createdAt: 'asc'
                }],
            });
            return bids;
        } catch (error) {
            console.error(error);
            throw new BadRequestException(
                `Something went wrong while getting guesses for location with id ${locationId}!`,
            );
        }
    }
}
