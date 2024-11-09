/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { paginationHelper } from 'src/types/paginationHelper';

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

    async getProducts(filters: any, options: any) {
        const { limit, page, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
        const { name } = filters;
        const andConditions: any[] = [];

        if (name) {
            andConditions.push({
                name: {
                    contains: name,
                    mode: 'insensitive',
                }
            });
        }

        const whereConditions: Prisma.ProductWhereInput =
            andConditions.length > 0 ? { AND: andConditions } : {};

        const result = await this.prisma.product.findMany({
            where: whereConditions,
            skip: skip,
            take: limit,
            orderBy: sortBy && sortOrder
                ? { [sortBy]: sortOrder }
                : { createdAt: 'desc' },
        });

        const filteredResult = result.map(product => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { userId, ...rest } = product;
            return rest;
        });

        const total = await this.prisma.product.count({
            where: whereConditions,
        });

        return {
            meta: {
                total,
                page,
                limit,
            },
            data: filteredResult,
        };
    }


    async getProductById(id: number): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: { id },
        });
    }

    async updateProduct(id: number, data: Partial<Product>): Promise<Product> {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async deleteProduct(id: number): Promise<boolean> {
        try {
            await this.prisma.product.delete({
                where: { id },
            });
            return true;
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException(`Product with ID ${id} not found`);
            }
            throw error;
        }
    }
}