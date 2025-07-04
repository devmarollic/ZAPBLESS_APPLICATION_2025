// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { googleCallbackUseCase } from '../use_case/google_callback_use_case';

// -- TYPES

export class GoogleCallbackController
{
    // -- OPERATIONS

    async handle(
        request,
        response
        )
    {
        try
        {
            // Get code from query parameters (Google sends it as query param)
            let { code } = request.query;

            if ( !code )
            {
                return response.status( StatusCodes.BAD_REQUEST ).send( {
                    success: false,
                    message: 'Authorization code is required'
                } );
            }

            let { user, session } = await googleCallbackUseCase.execute( { code } );

            response.status( StatusCodes.OK ).send( { 
                success: true,
                user, 
                session 
            } );
        }
        catch ( error )
        {
            response.status( StatusCodes.INTERNAL_SERVER_ERROR ).send( {
                success: false,
                message: error.message || 'Failed to process Google callback',
                error: error.code || 'UNKNOWN_ERROR'
            } );
        }
    }
}