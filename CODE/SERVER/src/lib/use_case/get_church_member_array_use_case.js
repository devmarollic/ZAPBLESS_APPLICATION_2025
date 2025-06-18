// -- IMPORTS

import { ministryService } from '../service/ministry_service';
import { profileService } from '../service/profile_service';

// -- CLASS

class GetChurchMemberArrayUseCase
{
    // -- INQUIRIES

    async execute(
        input
        )
    {
        let churchId = input.churchId;

        let memberArray = await profileService.getProfileArrayByChurchId( churchId );

        return memberArray;
    }
}

// -- VARIABLES

export let getChurchMemberArrayUseCase = new GetChurchMemberArrayUseCase();

