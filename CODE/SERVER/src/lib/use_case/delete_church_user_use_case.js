// -- IMPORTS

import { z, ZodError } from 'zod';
import { profileService } from '../service/profile_service';
import { userChurchRoleService } from '../service/role_service';
import { AppError } from '../errors/app_error';
import { authentificationService } from '../service/authentification_service';

// -- SCHEMA

let deleteChurchUserSchema = z.object(
    {
        userId: z.string(),
        churchId: z.string()
    }
    );

// -- TYPES

class DeleteChurchUserUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, error, data } = await deleteChurchUserSchema.safeParseAsync( input );

        if ( !success )
        {
            throw new ZodError( error );
        }

        let { userId, churchId } = data;

        let userChurchId = await profileService.getChurchIdByProfileId( userId );

        if ( userChurchId !== churchId )
        {
            throw new AppError( 'USER_NOT_IN_CHURCH', 403 );
        }

        let deleted = await userChurchRoleService.deleteUserChurchRoleByProfileIdAndChurchId(
            churchId,
            userId
            );

        let deletedProfile = await profileService.removeProfileById( userId );
        let removeAuthUser = await authentificationService.removeUserById( userId );

        return deleted;
    }
}

// -- VARIABLES

export let deleteChurchUserUseCase = new DeleteChurchUserUseCase(); 