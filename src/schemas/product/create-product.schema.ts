/* eslint-disable prettier/prettier */
import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string().trim(),
    description: z.string().trim().optional(),
    price: z.number().positive(),
    category: z.string().trim(),
});
