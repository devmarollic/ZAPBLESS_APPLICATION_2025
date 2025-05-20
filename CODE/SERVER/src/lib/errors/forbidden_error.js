// -- IMPORTS

import { AppError } from './app_error';
import { StatusCodes } from 'http-status-codes';

// -- TYPES

export class ForbiddenError extends AppError
{
    // -- CONSTRUCTORS

    constructor(
        message = 'unauthorized-error-message',
        statusCode = StatusCodes.FORBIDDEN
        )
    {
        super( message, statusCode );
    }
}