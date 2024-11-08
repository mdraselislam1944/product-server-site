import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    category: number;
  }) {
    return this.prisma.product.create({
      data,
    });
  }

  async getProductById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async getAllProducts() {
    return this.prisma.product.findMany();
  }

  async updateProduct(
    id: number,
    data: {
      name?: string;
      description?: string;
      price?: number;
      category?: number;
    },
  ) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
