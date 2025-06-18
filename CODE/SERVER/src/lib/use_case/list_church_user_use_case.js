// -- IMPORTS

import { profileService } from "../service/profile_service";


// -- TYPES

class ListChurchUserUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let churchUserArray = await profileService.getProfileArrayByChurchId(
            input.churchId
            );

        return churchUserArray;
    }
}

// -- VARIABLES

export let listChurchUserUseCase = new ListChurchUserUseCase();