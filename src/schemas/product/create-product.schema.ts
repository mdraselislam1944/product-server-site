/* eslint-disable prettier/prettier */
import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(10).optional(),
    price: z.number().positive(),
    category: z.number().int().positive(),
});
