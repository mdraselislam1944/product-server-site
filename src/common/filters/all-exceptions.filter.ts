/* eslint-disable prettier/prettier */
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            statusCode: status,
            message: 'An error occurred',
            error:
                exception instanceof HttpException
                    ? exception.getResponse()
                    : 'Internal server error',
            timestamp: new Date().toISOString(),
            path: request.url,
        };

        response.status(status).json(errorResponse);
    }
}