/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email', required: true })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password', required: true })
    @IsString()
    @IsNotEmpty()
    password: string;
}