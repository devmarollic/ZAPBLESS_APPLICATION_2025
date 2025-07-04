// -- IMPORTS

import { authentificationService } from '../service/authentification_service';

// -- TYPES

export class GoogleLoginUseCase
{
    // -- OPERATIONS

    async execute(
        )
    {
        let url = await authentificationService.googleLogin();

        return url;
    }
}

// -- VARIABLES

export let googleLoginUseCase = new GoogleLoginUseCase();