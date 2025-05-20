// -- IMPORTS

import { AppError } from './app_error';
import { StatusCodes } from 'http-status-codes';

// -- TYPES

export class NotFoundError extends AppError
{
    // -- CONSTRUCTORS

    constructor(
        message = 'not-found-error-message',
        statusCode = StatusCodes.NOT_FOUND
        )
    {
        super( message, statusCode );
    }
}