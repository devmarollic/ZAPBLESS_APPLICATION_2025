// -- IMPORTS

import { z, ZodError } from 'zod';
import { profileService } from '../service/profile_service';
import { AppError } from '../errors/app_error';
import { userChurchRoleService } from '../service/role_service';

// -- TYPES

let profileSchema = z.object(
    {
        profileId: z.string(),
        roleSlugArray: z.array( z.enum( [ 'administrator', 'minister', 'leader', 'secretary', 'treasurer', 'user' ] ) ),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().optional(),
        phonePrefix: z.string().optional(),
        phoneNumber: z.string().optional(),
        statusId: z.enum( [ 'active', 'inactive' ] ).optional(),
        churchId: z.string()
    }
    );

class SetChurchUserUseCase
{
    // -- OPERATIONS
    
    async execute(
        input
        )
    {
        let { success, error, data } = await profileSchema.safeParseAsync( input );


        if ( !success )
        {
            throw new ZodError( error );
        }

        let { profileId, roleSlugArray, churchId, ...profile } = data;

        profile.legalName = [ profile.firstName, profile.lastName ].filter( Boolean ).join( ' ' );

        for ( let roleSlug of roleSlugArray )
        {
            await userChurchRoleService.setOrCreateUserChurchRoleByProfileIdAndChurchId(
                churchId,
                profileId,
                roleSlug
                );
        }

        let updatedProfile = await profileService.setProfileById(
            profile,
            profileId
            );

        return updatedProfile;
    }
}

// -- VARIABLES

export let setChurchUserUseCase = new SetChurchUserUseCase();