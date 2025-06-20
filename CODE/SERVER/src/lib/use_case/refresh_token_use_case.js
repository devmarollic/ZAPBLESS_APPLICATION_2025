// -- IMPORTS

import { authentificationService } from '../service/authentification_service';

// -- TYPES

class RefreshTokenUseCase
{
    // -- OPERATIONS

    async execute(
        refreshToken
        )
    {
        let token = await authentificationService.refreshToken( refreshToken );

        return token;
    }
}

// -- VARIABLES

export let refreshTokenUseCase
    = new RefreshTokenUseCase();