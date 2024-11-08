import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(
    @Body()
    data: {
      name: string;
      description: string;
      price: number;
      category: number;
    },
  ) {
    return this.productService.createProduct(data);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(Number(id));
  }

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body()
    data: {
      name?: string;
      description?: string;
      price?: number;
      category?: number;
    },
  ) {
    return this.productService.updateProduct(Number(id), data);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(Number(id));
  }
}
