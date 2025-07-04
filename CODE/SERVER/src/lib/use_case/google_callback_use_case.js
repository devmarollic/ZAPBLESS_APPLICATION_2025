// -- IMPORTS

import { z } from 'zod';
import { authentificationService } from '../service/authentification_service';

// -- CONSTANTS

const googleCallbackSchema = z.object( {
    code: z.string()
} );

// -- TYPES

export class GoogleCallbackUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { error, data, success } = await googleCallbackSchema.safeParseAsync( input );

        if ( !success )
        {
            throw new Error( `Invalid callback data: ${error.errors[0].message}` );
        }

        let { user, session } = await authentificationService.googleCallback( data.code );

        return { user, session };
    }
}

// -- VARIABLES

export let googleCallbackUseCase = new GoogleCallbackUseCase();