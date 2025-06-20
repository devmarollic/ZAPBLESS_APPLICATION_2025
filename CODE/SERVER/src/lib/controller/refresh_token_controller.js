// -- IMPORTS

import { refreshTokenUseCase } from "../use_case/refresh_token_use_case";

// -- TYPES

export class RefreshTokenController
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let { refreshToken } = request.body;

        let token = await refreshTokenUseCase.execute( refreshToken );

        return token;
    }
}