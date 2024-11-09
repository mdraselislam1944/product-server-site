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
                throw new BadRequestException(error.errors);
            }
            throw error;
        }
    }
}