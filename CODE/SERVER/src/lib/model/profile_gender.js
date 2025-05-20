// -- IMPORTS

import { z } from 'zod';

// -- CONSTANTS

export const profileGenderEnum = z.enum(
    [
        'male',
        'female'
    ]
    );