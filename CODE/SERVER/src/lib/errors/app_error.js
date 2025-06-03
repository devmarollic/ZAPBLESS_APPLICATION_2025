// -- IMPORTS

import { StatusCodes } from 'http-status-codes';

// -- TYPES

export class AppError extends Error
{
    // -- CONSTRUCTORS

    constructor(
        code,
        statusCode = 400
        )
    {
        super( code );

        this.code = code;
        this.statusCode = statusCode;
    }
}