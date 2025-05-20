// -- IMPORTS

import { StatusCodes } from 'http-status-codes';

// -- TYPES

export class AppError extends Error
{
    // -- CONSTRUCTORS

    constructor(
        message = 'bad-request-error-message',
        statusCode = StatusCodes.BAD_REQUEST
        )
    {
        super( message );
        this.statusCode = statusCode;
    }
}