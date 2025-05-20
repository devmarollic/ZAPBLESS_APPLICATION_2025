// -- IMPORTS

import { AppError } from './app_error';
import { StatusCodes } from 'http-status-codes';

// -- TYPES

export class UnauthenticatedError extends AppError
{
    // -- CONSTRUCTORS

    constructor(
        message = 'unauthenticated-error-message',
        statusCode = StatusCodes.UNAUTHORIZED
        )
    {
        super( message, statusCode );
    }
}