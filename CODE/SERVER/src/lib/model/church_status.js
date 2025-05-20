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