/* eslint-disable prettier/prettier */

import { z } from 'zod';

export const deleteProductSchema = z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a valid number'),
});
