// -- IMPORTS

import { AppError } from './app_error';
import { StatusCodes } from 'http-status-codes';

// -- TYPES

export class ValidationError extends AppError
{
    // -- CONSTRUCTORS

    constructor(
        message = 'validation-error-message',
        statusCode = StatusCodes.BAD_REQUEST
        )
    {
        super( message, statusCode );
    }
} 