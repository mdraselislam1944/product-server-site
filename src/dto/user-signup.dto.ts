/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UserSignupDto {
    @ApiProperty({ example: 'user@example.com', description: 'User email', required: true })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password', required: true })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: UserRole.user, description: 'User role (e.g., USER or ADMIN)', enum: UserRole, required: true })
    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole;
}
