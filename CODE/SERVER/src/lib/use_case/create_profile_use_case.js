// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { profileSchema } from '../model/profile';
import { authentificationService } from '../service/authentification_service';
import { profileService } from '../service/profile_service';
import { userChurchRoleService } from '../service/role_service';

//  TYPES

class CreateProfileUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, error, data } = profileSchema.safeParse( input );

        if ( !success )
        {
            return error;
        }

        let user = await authentificationService.signUpUser(
            data.email,
            data.password,
            {
                first_name: data.firstName,
                last_name: data.lastName
            }
            );

        let profile = await profileService.setProfileByEmail(
            {
                churchId: data.churchId,
                statusId: 'active',
                genderId: data.genderId,
                phonePrefix: data.phonePrefix,
                phoneNumber: data.phoneNumber,
                countryCode: data.countryCode,
                imagePath: data.imagePath,
                birthDate: data.birthDate,
                legalName: data.legalName
            },
            data.email
            );

        await userChurchRoleService.addUserChurchRole(
            {
                profileId: profile.id,
                churchId: profile.churchId,
                roleSlug: 'administrator'
            }
            );

        return profile;
    }
}

// -- VARIABLES

export const createProfileUseCase
    = new CreateProfileUseCase();