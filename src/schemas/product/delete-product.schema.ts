/* eslint-disable prettier/prettier */
import { z } from 'zod';

export const deleteProductSchema = z.object({
    id: z.number().int().positive(),
});
