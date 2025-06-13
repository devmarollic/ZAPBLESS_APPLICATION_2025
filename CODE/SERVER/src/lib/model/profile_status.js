// -- IMPORTS

import { z } from 'zod';

// -- CONSTANTS

export const profileStatusEnum = z.enum(
    [
        'active',
        'inactive'
    ]
    );

export const profileStatus =
    {
        active: 'active',
        inactive: 'inactive'
    };