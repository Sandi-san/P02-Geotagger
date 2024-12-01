import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/user-update.dto';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
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
            //check prisma errors
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
            console.log("Old pass: ",old_password)
            console.log("DB pass: ",user.password)
            if (!pwMatchOld)
                throw new BadRequestException('Old password is incorrect!');

            //check new password
            if (password != confirm_password)
                throw new BadRequestException('Password and confirm password do not match!')
            const pwMatch = await bcrypt.compare(password,user.password);
            if (pwMatch)
                throw new BadRequestException('New password cannot be same as old password!')

            //save new password
            const newPashHash = await bcrypt.hash(password, 10);
            try {
                await this.prisma.user.update({
                    where: { id },
                    data: { password: newPashHash } //change only password
                });
                return { response: 'Password changed successfully' }
            }
            catch (error) {
                //check prisma client error
                if (error instanceof PrismaClientKnownRequestError) {
                    if (error.code === 'P2025')
                        throw new BadRequestException(`Id ${id} is invalid!`);
                } else {
                    throw new BadRequestException(
                        'Something went wrong while updating user password!',
                    );
                }
            }
        }
        else
            throw new BadRequestException('Please input and confirm new password!');
        return { response: 'Something went wrong while changing password!' };
    }
}
