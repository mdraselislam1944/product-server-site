/* eslint-disable prettier/prettier */
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodError } from 'zod';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: z.ZodTypeAny) { }

    transform(value: any) {
        try {
            this.schema.parse(value);
            return value;
        } catch (error) {
            if (error instanceof ZodError) {

                const formattedErrors = error.errors.map(err => ({
                    field: err.path[0],
                    message: this.formatErrorMessage(err),
                }));


                throw new BadRequestException({
                    statusCode: 400,
                    message: 'Validation failed',
                    errors: formattedErrors,
                });
            }
            throw error;
        }
    }

    private formatErrorMessage(error: any): string {
        switch (error.code) {
            case 'invalid_type':
                if (error.received === 'undefined') {
                    return `The field ${error.path[0]} is required.`;
                }
                return `The field ${error.path[0]} must be a ${error.expected}, but received ${error.received}.`;
            case 'too_small':
                return `The field ${error.path[0]} is too small. It should have at least ${error.minimum} characters.`;
            case 'too_big':
                return `The field ${error.path[0]} is too large. It should have at most ${error.maximum} characters.`;
            case 'invalid_enum_value':
                return `The field ${error.path[0]} must be one of the following values: ${error.options.join(', ')}`;
            default:
                return `The field ${error.path[0]} is invalid.`;
        }
    }
}