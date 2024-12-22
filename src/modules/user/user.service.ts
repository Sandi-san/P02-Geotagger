import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, UserAction } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { CreateUserActionDto, UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
    ) { }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        //delete unused fields (from dto)
        delete updateUserDto.confirm_password;
        delete updateUserDto.old_password;
        delete updateUserDto.password;

        try {
            const updatedUser = await this.prisma.user.update({
                where: { id },
                data: {
                    ...updateUserDto,
                    //password remains unchanged from this method (edge case)
                    password: undefined,
                },
            });
            return updatedUser;
        } catch (error) {
            //check prisma errors
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002')
                    throw new ForbiddenException('Email already taken!');
                else if (error.code === 'P2025')
                    throw new BadRequestException(`Id ${id} is invalid!`);
            } else {
                Logger.error(error);
                throw new BadRequestException(
                    'Something went wrong while updating user!',
                );
            }
        }
    }

    async updatePassword(id: number, updateUserDto: UpdateUserDto): Promise<{ response: string }> {
        const user = await this.prisma.user.findUnique({ where: { id } })
        if (!user)
            throw new NotFoundException(`User with id \'${id}\' does not exist!`);

        //destruct variables from dto
        const { old_password, password, confirm_password } = updateUserDto;

        if (password && confirm_password) {
            //check old password
            if (!old_password)
                throw new BadRequestException('Please input old password!');
            //Note: compare input must be in this exact order
            const pwMatchOld = await bcrypt.compare(old_password, user.password);
            if (!pwMatchOld)
                throw new BadRequestException('Old password is incorrect!');

            //check new password
            if (password != confirm_password)
                throw new BadRequestException('Password and confirm password do not match!')
            const pwMatch = await bcrypt.compare(password, user.password);
            if (pwMatch)
                throw new BadRequestException('New password cannot be same as old password!')

            //save new password
            const newPashHash = await bcrypt.hash(password, 10);
            try {
                await this.prisma.user.update({
                    where: { id },
                    data: { password: newPashHash } //change only password
                });
                return { response: 'Password changed successfully!' }
            }
            catch (error) {
                if (error instanceof PrismaClientKnownRequestError) {
                    if (error.code === 'P2025')
                        throw new BadRequestException(`Id ${id} is invalid!`);
                } else {
                    Logger.error(error);
                    throw new BadRequestException(
                        'Something went wrong while updating user password!',
                    );
                }
            }
        }
        throw new BadRequestException('Please input and confirm new password!');
    }

    async updateImage(id: number, image: string): Promise<User> {
        //call user update with only avatar string
        return this.update(id, { image });
    }


    async getLocations(userId: number, take = 4, page = 1, relations = []): Promise<PaginatedResult> {
        try {
            const locations = await this.prisma.location.findMany({
                where: { userId },
                orderBy: {
                    updatedAt: 'asc',
                }
            })

            const total = locations.length
            const paginatedLocations = locations.slice((page - 1) * take, page * take)

            return {
                data: paginatedLocations,
                meta: {
                    total,
                    page,
                    last_page: Math.ceil(total / take)
                }
            }

        }
        catch (error) {
            throw new InternalServerErrorException(
                `Something went wrong while searching for locations from user with id '${userId}'`,
            )
        }
    }

    async getGuesses(userId: number, take = 4, page = 1, relations = []): Promise<PaginatedResult> {
        try {
            const guesses = await this.prisma.guess.findMany({
                where: { userId },
                orderBy: [{
                    errorDistance: 'asc',
                },
                {
                    createdAt: 'asc',
                }]
            })

            //console.log("Guesses: ", guesses)

            const total = guesses.length
            const paginatedGuesses = guesses.slice((page - 1) * take, page * take)

            return {
                data: paginatedGuesses,
                meta: {
                    total,
                    page,
                    last_page: Math.ceil(total / take)
                }
            }

        }
        catch (error) {
            throw new InternalServerErrorException(
                `Something went wrong while searching for guesses from user with id '${userId}'`,
            )
        }
    }

    async saveActions(userId: number, dto: CreateUserActionDto): Promise<{ response: string }> {
        try {
            //parse each action from an array of actions, add userId
            const actions = dto.actions.map((action) => ({
                ...action,
                userId
            }))

            //save the actions
            await this.prisma.userAction.createMany({
                data: actions
            })
            const numActions = actions.length
            return { response: `Saved ${numActions} actions of user with id: ${userId}.` }
        }
        catch (error) {
            Logger.error(error)
            return { response: `Something went wrong while saving actions of user with id: ${userId}!` }
        }
    }

    async getActions(take: number): Promise<UserAction[]> {
        try {
            return await this.prisma.userAction.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                take
            })
        }
        catch (error) {
            throw new InternalServerErrorException(
                'Something went wrong while fetching user actions!',
            )
        }
    }
}
