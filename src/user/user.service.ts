import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/user-update.dto';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
        delete updateUserDto.image;

        try {
            const updatedUser = await this.prisma.user.update({
                where: { id },
                data: {
                    ...updateUserDto,
                    //password & image remain unchanged from this method (edge case)
                    password: undefined,
                    image: undefined,
                },
            });
            return updatedUser;
        } catch (error) {
            //check prisma error
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002')
                    throw new ForbiddenException('Email already taken!');
                else if (error.code === 'P2025')
                    throw new BadRequestException(`Id ${id} is invalid!`);
            } else {
                console.log(error);
                throw new BadRequestException(
                    'Something went wrong while updating user!',
                );
            }
        }
    }
}
