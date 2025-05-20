// -- IMPORTS

import { z } from 'zod';

// -- CONSTANTS

export const countryCodeEnum = z.enum(
    [
        'BR',
        'US'
    ]
    );