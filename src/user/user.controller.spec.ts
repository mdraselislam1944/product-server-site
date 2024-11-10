/* eslint-disable prettier/prettier */
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserSignupDto } from 'src/dto/user-signup.dto';
import { UserLoginDto } from 'src/dto/user-login.dto';
import { HttpStatus, HttpException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
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

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userSignupDto: UserSignupDto = { email: 'test@example.com', password: 'password', role: UserRole.admin };

      const mockResponse = { 
        id: 1, 
        email: 'test@example.com', 
        role: UserRole.admin,  
        password: 'password' 
      };

      jest.spyOn(userService, 'createUser').mockResolvedValue(mockResponse);

      const result = await userController.createUser(userSignupDto);
      expect(result).toEqual(mockResponse);
      expect(userService.createUser).toHaveBeenCalledWith(userSignupDto.email, userSignupDto.password, userSignupDto.role);
    });
  });

  describe('login', () => {
    it('should login a user and return a token', async () => {
      const userLoginDto: UserLoginDto = { email: 'test@example.com', password: 'password' };
      const mockResponse = { token: 'jwt_token_here' };
      jest.spyOn(userService, 'login').mockResolvedValue(mockResponse as any);

      const result = await userController.login(userLoginDto);
      expect(result).toEqual(mockResponse);
      expect(userService.login).toHaveBeenCalledWith(userLoginDto.email, userLoginDto.password);
    });

    it('should throw an HttpException if login fails', async () => {
      const userLoginDto: UserLoginDto = { email: 'test@example.com', password: 'wrong_password' };
      jest.spyOn(userService, 'login').mockRejectedValue(new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED));

      await expect(userController.login(userLoginDto)).rejects.toThrow(HttpException);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateData = { email: 'updated@example.com', role: UserRole.admin }; 
      const mockResponse = { id: 1, email: 'updated@example.com', role: UserRole.admin }; 
      jest.spyOn(userService, 'updateUser').mockResolvedValue(mockResponse as any);

      const result = await userController.updateUser(userId, updateData);
      expect(result).toEqual(mockResponse);
      expect(userService.updateUser).toHaveBeenCalledWith(+userId, updateData);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const userId = '1';
      const mockResponse = { message: 'User successfully deleted' };
      jest.spyOn(userService, 'deleteUser').mockResolvedValue(mockResponse as any);

      const result = await userController.deleteUser(userId);
      expect(result).toEqual(mockResponse);
      expect(userService.deleteUser).toHaveBeenCalledWith(+userId);
    });
  });
});
