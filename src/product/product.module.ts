/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule,
    JwtModule.register({
      secret: process.env.jwt_secret_key,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [ProductService, JwtAuthGuard],
  controllers: [ProductController],
})
export class ProductModule { }
