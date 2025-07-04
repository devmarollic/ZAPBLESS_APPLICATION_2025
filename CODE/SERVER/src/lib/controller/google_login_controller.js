// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { googleLoginUseCase } from '../use_case/google_login_use_case';

// -- TYPES

export class GoogleLoginController
{
    // -- OPERATIONS

    async handle(
        request,
        response
        )
    {
        let url = await googleLoginUseCase.execute();

        response.status( StatusCodes.OK ).send( { url } );
    }
}
