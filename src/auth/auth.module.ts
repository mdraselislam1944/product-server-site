/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.jwt_secret_key, 
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [UserController],
    providers: [UserService, PrismaService, JwtStrategy],
    exports: [JwtModule],
})
export class AuthModule { }

