/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }


    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();


        const authorization = request.headers['authorization'];


        if (!authorization) {
            throw new UnauthorizedException('Authorization header missing');
        }

        try {

            const token = authorization.split(' ')[1];


            const user = await this.jwtService.verifyAsync(token);


            request.user = user;


            return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {

            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
