// -- IMPORTS

import { z } from 'zod';

// -- TYPES

export const ministrySchema = z.object(
    {
        name: z.string(),
        description: z.string().optional()
    }
    );

export const ministryWithChurchIdSchema = ministrySchema.extend(
    {
        churchId: z.string()
    }
    );