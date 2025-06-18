// -- IMPORTS

import { z } from 'zod';

// -- CONSTANTS

export const ministryMemberSchema = z.object(
    {
        ministryId: z.string(),
        profileId: z.string().uuid(),
        roleSlug: z.string()
    }
    );

export const ministryMemberRoleSlugEnum = z.enum(
    [
        'leader',
        'vice-leader',
        'volunteer',
        'member'
    ]
    );

export const ministryMemberRoleSlug =
    {
        leader: 'leader',
        viceLeader: 'vice-leader',
        volunteer: 'volunteer',
        member: 'member'
    };