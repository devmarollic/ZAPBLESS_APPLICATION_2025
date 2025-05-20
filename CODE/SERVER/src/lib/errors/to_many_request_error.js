// -- IMPORTS

import { AppError } from './app_error';
import { StatusCodes } from 'http-status-codes';

// -- TYPES

export class ToManyRequestError extends AppError
{
    // -- CONSTRUCTORS

    constructor(
        message = 'to-many-request-error-message',
        statusCode = StatusCodes.TOO_MANY_REQUESTS
        )
    {
        super( message, statusCode );
    }
}