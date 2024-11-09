/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async createUser(email: string, plainPassword: string, role: UserRole): Promise<User> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        return this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
            },
        });
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { userId: user.id, role: user.role };
        const token = this.jwtService.sign(payload);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;

        return { ...userWithoutPassword, token };
    }

    async updateUser(id: number, data: Partial<User>): Promise<User> {
        if (data.password) {
            const saltRounds = 10;
            data.password = await bcrypt.hash(data.password, saltRounds);
        }
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async deleteUser(id: number): Promise<void> {
        await this.prisma.user.delete({
            where: { id },
        });
    }
}