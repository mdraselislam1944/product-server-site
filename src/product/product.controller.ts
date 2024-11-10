/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, UsePipes, Res, HttpStatus, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { createProductSchema } from 'src/schemas/product/create-product.schema';
import { deleteProductSchema } from 'src/schemas/product/delete-product.schema';
import { Response } from 'express';
import { sendResponse } from 'src/common/utils/sendResponse';
import { IGetUserAuthInfoRequest } from 'src/types/express';
import pick from 'src/types/pick';

@ApiTags('Products')
@Controller('products')
export class ProductController {
    constructor(private productService: ProductService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Product name (required)' },
                description: { type: 'string', description: 'Product description (optional)' },
                price: { type: 'number', description: 'Product price (required)' },
                category: { type: 'string', description: 'Product category (required)' },
            },
            required: ['name', 'price', 'category'],
            example: {
                name: 'string',
                description: 'string',
                price: 'number',
                category: 'string',
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Product created successfully',
        schema: {
            example: {
                statusCode: 201,
                success: true,
                message: 'Product created successfully',
                data: {
                    id: 'number',
                    name: 'string',
                    description: 'string',
                    price: 'number',
                    category: 'string',
                    createdAt: 'Date',
                    updatedAt: 'Date',
                }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Failed to create product', schema: { example: { statusCode: 400, success: false, message: 'Failed to create product', errors: [{ message: 'Validation error' }] } } })
    @UsePipes(new ZodValidationPipe(createProductSchema))
    async createProduct(
        @Body() data: { name: string; description?: string; price: number; category: string },
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
    @ApiOperation({ summary: 'Retrieve a list of products' })
    @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of products per page' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
    @ApiQuery({ name: 'sortBy', required: false, enum: ['price', 'createdAt'], description: 'Field to sort by' })
    @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'], description: 'Sort order' })
    @ApiQuery({ name: 'search', required: false, type: String, description: 'Keyword to search in name or description' })
    @ApiResponse({
        status: 200,
        description: 'Products retrieved successfully',
        schema: {
            example: {
                statusCode: 200,
                success: true,
                message: 'Products retrieved successfully',
                data: {
                    meta: { total: 10, page: 1, limit: 5 },
                    data: [
                        {
                            id: "number",
                            name: 'string',
                            description: 'string',
                            price: "number",
                            category: 'string',
                            createdAt: 'Date',
                            updatedAt: 'Date'
                        }
                    ]
                }
            }
        }
    })
    @ApiResponse({
        status: 500,
        description: 'Failed to retrieve products',
        schema: { example: { statusCode: 500, success: false, message: 'Failed to retrieve products', errors: [{ message: 'Internal server error' }] } }
    })
    async getProducts(@Res() res: Response, @Query() query: any) {
        const filters = pick(query, ['category', 'search']);
        const options = pick(query, ['limit', 'page', 'sortBy', 'sortOrder']);

        try {
            const products = await this.productService.getProducts(filters, options);
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
    @ApiOperation({ summary: 'Retrieve a single product by ID' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({
        status: 200,
        description: 'Product retrieved successfully',
        schema: {
            example: {
                statusCode: 200,
                success: true,
                message: 'string',
                data: {
                    id: 'number',
                    name: 'string',
                    description: 'string',
                    price: 'number',
                    category: 'string',
                    createdAt: 'Date',
                    updatedAt: 'Date',
                }
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Product not found',
        schema: { example: { statusCode: 404, success: false, message: 'Product with ID  not found', errors: [{ field: 'id', message: 'No product found with ID ' }] } }
    })
    @ApiResponse({
        status: 500,
        description: 'Failed to retrieve product',
        schema: { example: { statusCode: 500, success: false, message: 'Failed to retrieve product', errors: [{ message: 'Internal server error' }] } }
    })
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
    @Put(':id')
    @ApiOperation({ summary: 'Update an existing product' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiBody({
        schema: {
            example: {
                name: 'string',
                description: 'string',
                price: 'number',
                category: 'string'
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Product updated successfully',
        schema: {
            example: {
                statusCode: 200,
                success: true,
                message: 'Product updated successfully',
                data: {
                    id: 'number',
                    name: 'string',
                    description: 'string',
                    price: 'number',
                    category: 'string',
                    createdAt: 'Date',
                    updatedAt: 'Date',
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Failed to update product',
        schema: { example: { statusCode: 400, success: false, message: 'Failed to update product', errors: [{ message: 'Validation error' }] } }
    })
    async updateProduct(@Param('id') id: string, @Body() updateData: any, @Res() res: Response) {
        try {
            const product = await this.productService.updateProduct(+id, updateData);

            if (!product) {
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
                data: product,
            });
        } catch (error) {
            return sendResponse(res, {
                statusCode: HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to update product',
                errors: [{ message: error.message }],
            });
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete an existing product' })
    @ApiParam({ name: 'id', description: 'Product ID' })
    @ApiResponse({
        status: 200,
        description: 'Product deleted successfully',
        schema: {
            example: {
                statusCode: 200,
                success: true,
                message: 'Product deleted successfully',
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Product not found',
        schema: { example: { statusCode: 404, success: false, message: 'Product with ID  not found', errors: [{ field: 'id', message: 'No product found with ID ' }] } }
    })
    @ApiResponse({
        status: 500,
        description: 'Failed to delete product',
        schema: { example: { statusCode: 500, success: false, message: 'Failed to delete product', errors: [{ message: 'Internal server error' }] } }
    })
    @UsePipes(new ZodValidationPipe(deleteProductSchema))
    async deleteProduct(@Param('id') id: string, @Res() res: Response) {
        try {
            const deleted = await this.productService.deleteProduct(+id);

            if (!deleted) {
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
                message: 'Product deleted successfully',
            });
        } catch (error) {
            return sendResponse(res, {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'Failed to delete product',
                errors: [{ message: error.message }],
            });
        }
    }
}
