// -- IMPORTS

import { z } from 'zod';

// -- TYPES

export const eventSchema = z.object(
    {
        ministryId: z.string(),
        title: z.string(),
        description: z.string(),
        location: z.object(
            {
                type: z.literal( 'Point' ),
                coordinates: z.array(z.number())
            }
            ),
        statusId: z.string(),
        typeId: z.string(),
        startAtTimestamp: z.string().datetime(),
        endAtTimestamp: z.string().datetime()
    }
    ); 