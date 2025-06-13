// -- IMPORTS

import { z } from 'zod';

// -- CONSTANTS

export const churchStatusEnum = z.enum(
    [
        'active',
        'inactive',
        'suspended'
    ]
    );

export const churchStatus =
    {
        active: 'active',
        inactive: 'inactive',
        suspended: 'suspended'
    };