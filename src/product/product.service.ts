/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async createProduct(userId: number, name: string, description: string, price: number, category: number): Promise<Product> {
        return this.prisma.product.create({
            data: {
                name,
                description,
                price,
                category,
                userId,
            },
        });
    }

    async getProducts() {
        return this.prisma.product.findMany();
    }
    async getProductById(id: number): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: { id },
            include: { user: true },
        });
    }

    async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async deleteProduct(id: number): Promise<void> {
        await this.prisma.product.delete({
            where: { id },
        });
    }
}