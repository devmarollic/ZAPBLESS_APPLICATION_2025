// -- IMPORTS

import z, { ZodError } from 'zod';
import { authentificationService } from '../service/authentification_service';

// -- TYPES

const exchangeCodeSchema = z.object( {
    code: z.string().min( 1 )
} );

class ExchangeCodeUseCase
{
    execute(
        input
        )
    {
        let { data, error, success } = exchangeCodeSchema.safeParse( input );

        if ( !success )
        {
            throw new ZodError( error );
        }

        return authentificationService.exchangeCodeForSession( data.code );
    }
}

// -- VARIABLES

export const exchangeCodeUseCase = new ExchangeCodeUseCase();