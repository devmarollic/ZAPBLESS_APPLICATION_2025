// -- IMPORTS

import { z } from 'zod';

// -- TYPES

export const scheduleSchema = z.object(
    {
        churchId: z.string(),
        notificationTypeId: z.string(),
        notificationMediumId: z.string(),
        scheduleAtTimestamp: z.string().datetime(),
        eventId: z.string(),
        payload: z.array( z.any() ),
        statusId: z.string(),
        recurrenceId: z.string().optional(),
        startAtTimestamp: z.string().datetime().optional(),
        endAtTimestamp: z.string().datetime().optional()
    }
    );

export const scheduleStatus =
    {
        pending: 'pending',
        sent: 'sent',
        failed: 'failed'
    };