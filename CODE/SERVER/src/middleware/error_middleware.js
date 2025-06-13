// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';
import { AppError } from '../lib/errors/app_error';
import { logError } from 'senselogic-gist';

// -- FUNCTIONS

export async function errorMiddleware(
    error,
    request,
    reply
    )
{
    logError( error );

    if ( error instanceof AppError )
    {
        return reply
            .status( error.statusCode )
            .send(
                {
                    message: error.message
                }
                );
    }

    if ( error instanceof ZodError )
    {
        return reply
            .status( StatusCodes.BAD_REQUEST )
            .send(
                {
                    message: 'Validation error',
                    details: error.issues
                }
                );
    }

    return reply
        .status( StatusCodes.INTERNAL_SERVER_ERROR )
        .send(
            {
                message: 'Internal server error - ' + error.message
            }
            );
} 