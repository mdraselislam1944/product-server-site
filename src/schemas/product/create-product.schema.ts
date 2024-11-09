/* eslint-disable prettier/prettier */
import { z } from 'zod';

export const createProductSchema = z.object({
    userId: z.number().int().positive(),
    name: z.string().min(3),
    description: z.string().min(10),
    price: z.number().positive(),
    category: z.number().int().positive(),
});