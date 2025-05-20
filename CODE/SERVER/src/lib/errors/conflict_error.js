// -- IMPORTS

import { AppError } from './app_error';
import { StatusCodes } from 'http-status-codes';

// -- TYPES

export class ConflictError extends AppError
{
    // -- CONSTRUCTORS

    constructor(
        message = 'conflict-error-message',
        statusCode = StatusCodes.CONFLICT
        )
    {
        super( message, statusCode );
    }
}