/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, UsePipes, Res, HttpStatus, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { createProductSchema } from 'src/schemas/product/create-product.schema';
import { updateProductSchema } from 'src/schemas/product/update-product.schema';
import { deleteProductSchema } from 'src/schemas/product/delete-product.schema';
import { Response } from 'express';
import { sendResponse } from 'src/common/utils/sendResponse';
import { IGetUserAuthInfoRequest } from 'src/types/express';

@Controller('api/v1/products')
export class ProductController {
    constructor(private productService: ProductService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @UsePipes(new ZodValidationPipe(createProductSchema))
    async createProduct(
        @Body() data: { name: string; description?: string; price: number; category: number },
        @Req() req: IGetUserAuthInfoRequest,
        @Res() res: Response,
    ) {
        const { userId } = req.user;
        try {
            const product = await this.productService.createProduct(
                userId,
                data.name,
                data.description || '', 
                data.price,
                data.category
            );

            return sendResponse(res, {
                statusCode: HttpStatus.CREATED,
                success: true,
                message: 'Product created successfully',
                data: product,
            });
        } catch (error) {
            return sendResponse(res, {
                statusCode: HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to create product',
                errors: [{ message: error.message }],
            });
        }
    }

    @Get()
    async getProducts(@Res() res: Response) {
        try {
            const products = await this.productService.getProducts();
            return sendResponse(res, {
                statusCode: HttpStatus.OK,
                success: true,
                message: 'Products retrieved successfully',
                data: products,
            });
        } catch (error) {
            return sendResponse(res, {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'Failed to retrieve products',
                errors: [{ message: error.message }],
            });
        }
    }

    @Get(':id')
    async getProduct(@Param('id') id: string, @Res() res: Response) {
        try {
            const product = await this.productService.getProductById(+id);

            if (!product) {
                return sendResponse(res, {
                    statusCode: HttpStatus.NOT_FOUND,
                    success: false,
                    message: `Product with ID ${id} not found`,
                    errors: [{ field: 'id', message: `No product found with ID ${id}` }],
                });
            }


            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { userId, ...productData } = product;

            return sendResponse(res, {
                statusCode: HttpStatus.OK,
                success: true,
                message: 'Product retrieved successfully',
                data: productData,
            });
        } catch (error) {
            return sendResponse(res, {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'Failed to retrieve product',
                errors: [{ message: error.message }],
            });
        }
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ZodValidationPipe(updateProductSchema))
    @Put(':id')
    async updateProduct(
        @Param('id') id: string,
        @Body() data: Partial<{ name: string; description: string; price: number; category: number }>,
        @Res() res: Response,
    ) {
        try {
            const updatedProduct = await this.productService.updateProduct(+id, data);
            if (!updatedProduct) {
                return sendResponse(res, {
                    statusCode: HttpStatus.NOT_FOUND,
                    success: false,
                    message: `Product with ID ${id} not found`,
                    errors: [{ field: 'id', message: `No product found with ID ${id}` }],
                });
            }
            return sendResponse(res, {
                statusCode: HttpStatus.OK,
                success: true,
                message: 'Product updated successfully',
                data: updatedProduct,
            });
        } catch (error) {
            return sendResponse(res, {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'Failed to update product',
                errors: [{ message: error.message }],
            });
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @UsePipes(new ZodValidationPipe(deleteProductSchema))
    @Delete(':id')
    async deleteProduct(@Param('id') id: string, @Res() res: Response) {
        try {
            const deleted = await this.productService.deleteProduct(+id);

            if (!deleted) {
                return sendResponse(res, {
                    statusCode: HttpStatus.NOT_FOUND,
                    success: false,
                    message: `Product with ID ${id} not found`,
                    errors: [{ field: 'id', message: `No product found with ID ${id}` }],
                    data: null,
                });
            }

            return sendResponse(res, {
                statusCode: HttpStatus.OK,
                success: true,
                message: 'Product deleted successfully',
                data: null,
            });
        } catch (error) {
            return sendResponse(res, {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'Failed to delete product',
                errors: [{ message: error.message }],
                data: null,
            });
        }
    }
}
