/* eslint-disable prettier/prettier */
import { Controller, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';

import { ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserSignupDto } from 'src/dto/user-signup.dto';
import { UserLoginDto } from 'src/dto/user-login.dto';


@Controller('api/v1')
export class UserController {
  constructor(private userService: UserService) { }

  @Post('signup')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    description: 'User data for signup',
    type: UserSignupDto,
    examples: {
      'application/json': {
        value: {
          email: 'string',
          password: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    schema: {
      example: {
        statusCode: 201,
        success: true,
        message: 'User successfully created',
        data: {
          id: 'number',
          email: "string",
          role: "admin|user",
          password: "hash string"
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
    schema: {
      example: {
        statusCode: 400,
        success: false,
        message: 'Invalid input',
        data: null,
      },
    },
  })
  async createUser(@Body() data: UserSignupDto) {
    return this.userService.createUser(data.email, data.password, data.role);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({
    description: 'Login credentials',
    type: UserLoginDto,
    examples: {
      'application/json': {
        value: {
          email: 'string',
          password: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      example: {
        statusCode: 200,
        success: true,
        message: 'User successfully logged in',
        data: { token: 'jwt_token_here' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        success: false,
        message: 'Unauthorized',
        data: null,
      },
    },
  })
  async login(@Body() body: UserLoginDto) {
    try {
      const user = await this.userService.login(body.email, body.password);
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Put('user/:id')
  @ApiOperation({ summary: 'Update user information' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({
    description: 'Updated user data',
    type: UserSignupDto,
    examples: {
      'application/json': {
        value: {
          email: 'string',
          password: 'password',
          role: 'admin|user',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
    schema: {
      example: {
        statusCode: 200,
        success: true,
        message: 'User successfully updated',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
    schema: {
      example: {
        statusCode: 400,
        success: false,
        message: 'Invalid input',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        success: false,
        message: 'User not found',
        data: null,
      },
    },
  })
  async updateUser(@Param('id') id: string, @Body() data: Partial<UserSignupDto>) {
    return this.userService.updateUser(+id, data);
  }

  @Delete('user/:id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User successfully deleted',
    schema: {
      example: {
        statusCode: 200,
        success: true,
        message: 'User successfully deleted',
        data: null,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      example: {
        statusCode: 404,
        success: false,
        message: 'User not found',
        data: null,
      },
    },
  })
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }
}
