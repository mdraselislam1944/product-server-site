/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { HttpStatus } from '@nestjs/common';
import { IGetUserAuthInfoRequest } from 'src/types/express';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;
  let res: Response;
  let req: Request;

  beforeEach(async () => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    req = {
      user: {
        userId: 1,
        role: 'user',
        iat: 1619703951,
        exp: 1619707551,
      },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),
    } as unknown as Request;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a new product successfully', async () => {
      const productData = { name: 'Product A', description: 'Description A', price: 100, category: 'Category A' };
      const mockProduct = { ...productData, id: 1, createdAt: new Date(), updatedAt: new Date() };
      
      jest.spyOn(productService, 'createProduct').mockResolvedValue(mockProduct as any);
      await productController.createProduct(productData, req as IGetUserAuthInfoRequest, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.CREATED,
        message: 'Product created successfully',
        data: mockProduct,
        success: true,      
        errors: undefined, 
        meta: undefined,    
      });
    });

    it('should handle errors while creating product', async () => {
      const productData = { name: 'Product A', description: 'Description A', price: 100, category: 'Category A' };
      jest.spyOn(productService, 'createProduct').mockRejectedValue(new Error('Error creating product'));
      await productController.createProduct(productData, req as IGetUserAuthInfoRequest, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Failed to create product',
        errors: [{ message: 'Error creating product' }],
        success: false,      
        data: undefined,   
        meta: undefined,   
      });
    });
  });

  describe('getProducts', () => {
    it('should retrieve a list of products successfully', async () => {
      const query = { category: 'Category A', page: 1, limit: 10 };
      const mockProducts = {
        meta: { total: 10, page: 1, limit: 10 },
        data: [
          { id: 1, name: 'Product A', price: 100, category: 'Category A', createdAt: new Date(), updatedAt: new Date() },
        ],
      };

      jest.spyOn(productService, 'getProducts').mockResolvedValue(mockProducts as any);

      await productController.getProducts(res, query);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.OK,
        message: 'Products retrieved successfully',
        data: mockProducts,
        success: true,     
        errors: undefined,  
        meta: undefined,  
      });
    });

    it('should handle errors while retrieving products', async () => {
      const query = { category: 'Category A', page: 1, limit: 10 };

      jest.spyOn(productService, 'getProducts').mockRejectedValue(new Error('Error retrieving products'));

      await productController.getProducts(res, query);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve products',
        errors: [{ message: 'Error retrieving products' }],
        success: false,      
        data: undefined,   
        meta: undefined, 
      });
    });
  });

  describe('getProduct', () => {
    it('should retrieve a product by id', async () => {
      const productId = '1';
      const mockProduct = { id: 1, name: 'Product A', price: 100, category: 'Category A', createdAt: new Date(), updatedAt: new Date() };

      jest.spyOn(productService, 'getProductById').mockResolvedValue(mockProduct as any);

      await productController.getProduct(productId, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.OK,
        message: 'Product retrieved successfully',
        data: mockProduct,
        success: true,      
        errors: undefined,  
        meta: undefined,    
      });
    });

    it('should return 404 if product not found', async () => {
      const productId = '1';
      jest.spyOn(productService, 'getProductById').mockResolvedValue(null);

      await productController.getProduct(productId, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Product with ID ${productId} not found`,
        errors: [{ field: 'id', message: `No product found with ID ${productId}` }],
        success: false,      
        data: undefined,   
        meta: undefined, 
      });
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const productId = '1';
      const updateData = { name: 'Updated Product', price: 200 };
      const mockProduct = { ...updateData, id: 1, createdAt: new Date(), updatedAt: new Date() };

      jest.spyOn(productService, 'updateProduct').mockResolvedValue(mockProduct as any);

      await productController.updateProduct(productId, updateData, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.OK,
        message: 'Product updated successfully',
        data: mockProduct,
        success: true,      
        errors: undefined,  
        meta: undefined, 
      });
    });

    it('should return 404 if product not found during update', async () => {
      const productId = '1';
      const updateData = { name: 'Updated Product', price: 200 };

      jest.spyOn(productService, 'updateProduct').mockResolvedValue(null);

      await productController.updateProduct(productId, updateData, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Product with ID ${productId} not found`,
        errors: [{ field: 'id', message: `No product found with ID ${productId}` }],
        success: false,      
        data: undefined,   
        meta: undefined, 
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', async () => {
      const productId = '1';

      jest.spyOn(productService, 'deleteProduct').mockResolvedValue(true);

      await productController.deleteProduct(productId, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.OK,
        message: 'Product deleted successfully',
        success: true,      
        errors: undefined,  
        meta: undefined, 
      });
    });

    it('should return 404 if product not found during delete', async () => {
      const productId = '1';

      jest.spyOn(productService, 'deleteProduct').mockResolvedValue(false);

      await productController.deleteProduct(productId, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Product with ID ${productId} not found`,
        errors: [{ field: 'id', message: `No product found with ID ${productId}` }],
        success: false,      
        data: undefined,   
        meta: undefined, 
      });
    });
  });
});
