/* eslint-disable prettier/prettier */
import { z } from 'zod';

export const updateProductSchema = z.object({
    userId: z.number().int().positive().optional(),
    name: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    category: z.number().int().positive().optional(),
});