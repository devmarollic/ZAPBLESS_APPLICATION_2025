// -- IMPORTS

import { z } from 'zod';

// -- CONSTANTS

export const documentTypeEnum = z.enum(
    [
        'cpf',
        'cnpj',
        'passport'
    ]
    );