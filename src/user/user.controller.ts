/* eslint-disable prettier/prettier */
import { Controller, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from '@prisma/client';

@Controller('api/v1')
export class UserController {
    constructor(private userService: UserService) { }

    @Post('signup')
    async createUser(@Body() data: { email: string; password: string; role: UserRole }) {
        return this.userService.createUser(data.email, data.password, data.role);
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
      try {
        const user = await this.userService.login(body.email, body.password);
        return user;
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
      }
    }

    @Put('user/:id')
    async updateUser(@Param('id') id: string, @Body() data: Partial<{ email: string; password: string; role: UserRole }>) {
        return this.userService.updateUser(+id, data);
    }

    @Delete('user/:id')
    async deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(+id);
    }
}
