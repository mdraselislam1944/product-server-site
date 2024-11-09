/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, UsePipes } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { createProductSchema } from 'src/schemas/product/create-product.schema';
import { updateProductSchema } from 'src/schemas/product/update-product.schema';
import { deleteProductSchema } from 'src/schemas/product/delete-product.schema';


@Controller('api/v1/products')
export class ProductController {
    constructor(private productService: ProductService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @UsePipes(new ZodValidationPipe(createProductSchema))
    async createProduct(@Body() data: { userId: number; name: string; description: string; price: number; category: number }) {
        return this.productService.createProduct(data.userId, data.name, data.description, data.price, data.category);
    }

    @Get()
    async getProducts() {
        return this.productService.getProducts();
    }

    @Get(':id')
    async getProduct(@Param('id') id: string) {
        return this.productService.getProductById(+id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ZodValidationPipe(updateProductSchema))
    @Put(':id')
    async updateProduct(@Param('id') id: string, @Body() data: Partial<{ name: string; description: string; price: number; category: number }>) {
        return this.productService.updateProduct(+id, data);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ZodValidationPipe(deleteProductSchema))
    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        return this.productService.deleteProduct(+id);
    }
}
