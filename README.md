
# Product Management API

## Overview

The **Product Management API** is a backend service built using **NestJS** to manage products and users for an e-commerce or inventory management system. This API allows administrators to manage products and users through secure endpoints, including JWT authentication for user roles (admin/user).



## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Endpoints](#api-endpoints)
- [Setup](#setup)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [License](#license)



## Features
- **User Authentication**: JWT-based authentication system with Passport.js.
- **Product Management**: Admin users can create, update, and delete products.
- **User Management**: User roles (admin, user) for different access levels.



## Tech Stack
- **Backend**: NestJS (v10.x)
- **Database**: PostgreSQL
- **ORM**: Prisma (v5.22.0)
- **Authentication**: JWT (jsonwebtoken, passport-jwt)
- **Validation**: class-validator, zod
- **Testing**: Jest, Supertest
- **Environment Management**: dotenv



## API Endpoints

### swagger api end point
- **GET api**
**
    - Get api documentation all response there.

### Authentication
- **POST api/v1/auth/signup**
**
    - signup or registration user.
    - **Request Body**: `{ "email": "string", "password": "string" }`
    - **Response**: `{ "user information" }`

- **PUT /api/v1/auth/user/:id**
**
    - role change as an admin
    - **Request Body**: `{ "role": "admin"}`
    - **Response**: `{ "user information" }`

- **POST api/v1/auth/login**
    - Logs in a user and returns a JWT token.
    - **Request Body**: `{ "email": "string", "password": "string" }`
    - **Response**: `{ "access_token": "JWT token" }`

### Product Management
- **POST /products**
    - Creates a new product.
    - **Request Body**:
        ```json
        {
          "name": "string",
          "description": "string",
          "price": "integer",
          "category": "string"
        }
        ```
    - **admin jwt token**:
        ```json
        {
          "authorization": "Bearer token"
        }
        ```
    - **Response**: `{ "id": "integer", "name": "string", "description": "string", "price": "integer", "category": "string" }`

- **GET /products**
    - Retrieves all products. 
    - **Response**: 
        ```json
        [
          {
            "id": "integer",
            "name": "string",
            "description": "string",
            "price": "integer",
            "category": "string"
          }
        ]
        ```

- **GET /products/:id**
    - Retrieves a single product by ID.
    - **Response**:
        ```json
        {
          "id": "integer",
          "name": "string",
          "description": "string",
          "price": "integer",
          "category": "string"
        }
        ```

- **PUT /products/:id**
    - Updates an existing product by ID.
    - **Request Body**:
        ```json
        {
          "name": "string",
          "description": "string",
          "price": "integer",
          "category": "string"
        }
        ```
        **admin jwt token**:
        ```json
        {
          "authorization": "Bearer token"
        }
        ```

    - **Response**: Updated product object.

- **DELETE /products/:id**
    - Deletes a product by ID.
        - **admin jwt token**:
        ```json
        {
          "authorization": "Bearer token"
        }
        ```
    - **Response**: `{ "message": "Product deleted successfully" }`



## Setup

### 1. Clone the repository

```bash
git clone https://github.com/mdraselislam1944/product-server-site
cd product_management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file at the root of the project and add the following variables:

```plaintext
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
jwt_secret_key="secret key"
```



## Running the Project

To start the server in development mode:

```bash
npm run start:dev
```

To run in production mode:

```bash
npm run start:prod
```



## Testing

This project uses **Jest** for unit testing. To run tests:

```bash
npm run test
```

For watching tests as you develop:

```bash
npm run test:watch
```

For coverage reports:

```bash
npm run test:cov
```



## Configuration

- **Prisma ORM**: The application uses **Prisma** for database migrations and schema management. You can find the schema under `prisma/schema.prisma`. After making changes to the schema, run:

```bash
npx prisma migrate dev
```



## License

This project is licensed under the **UNLICENSED** license.



## Notes

- **Security Considerations**: Always ensure that your `jwt_secret_key` is kept secret and is not shared or exposed in public repositories.
- **Database**: Make sure PostgreSQL is installed locally or on a server with the correct credentials to match the `.env` file's `DATABASE_URL`.
```



### Key Sections Explained:

1. **Features**: Briefly explains the core features of your API (authentication, product management, etc.).
2. **Tech Stack**: Lists the core technologies and tools you're using (NestJS, Prisma, PostgreSQL, etc.).
3. **API Endpoints**: Describes the various RESTful endpoints and their expected request/response formats.
4. **Setup**: Explains how to set up the project locally (clone the repo, install dependencies, set environment variables).
5. **Running the Project**: Provides instructions for running the app in different environments.
6. **Testing**: Instructions for running tests with Jest.
7. **Configuration**: Explains how to manage the database with Prisma.
8. **License**: States the project license.
