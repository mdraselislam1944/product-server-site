/* eslint-disable prettier/prettier */

import { z } from 'zod';

export const updateProductSchema = z.object({
    name: z.string().trim().optional(),
    description: z.string().trim().optional(),
    price: z.number().positive().optional(),
    category: z.string().trim().optional(),
});