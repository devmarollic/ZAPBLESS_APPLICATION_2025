// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { exchangeCodeUseCase } from '../use_case/exchange_code_use_case';

// -- TYPES

export class ExchangeCodeController
{
    async handle(
        request,
        response
        )
    {
        let { code } = request.query;

        let result = await exchangeCodeUseCase.execute( { code } );

        response.status( StatusCodes.OK ).send(
            {
                access_token: result.session.access_token,
                refresh_token: result.session.refresh_token
            }
            );
    }
}