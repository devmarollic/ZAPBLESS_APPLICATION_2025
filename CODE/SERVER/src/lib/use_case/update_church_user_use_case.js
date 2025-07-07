// -- IMPORTS

import { z, ZodError } from 'zod';
import { profileService } from '../service/profile_service';
import { userChurchRoleService } from '../service/role_service';
import { AppError } from '../errors/app_error';

// -- SCHEMA

let updateChurchUserSchema = z.object(
    {
        userId: z.string(),
        churchId: z.string(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phonePrefix: z.string().optional(),
        phoneNumber: z.string().optional(),
        role: z.enum([ 'administrator', 'minister', 'leader', 'secretary', 'treasurer', 'user' ]).optional(),
        statusId: z.enum([ 'active', 'inactive' ]).optional()
    }
    );

// -- TYPES

class UpdateChurchUserUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let { success, error, data } = await updateChurchUserSchema.safeParseAsync( input );

        if ( !success )
        {
            throw new ZodError( error );
        }

        let { userId, churchId, role, ...profileFields } = data;

        // Verifica se o usuário pertence à igreja
        let userChurchId = await profileService.getChurchIdByProfileId( userId );
        if ( userChurchId !== churchId )
        {
            throw new AppError( 'USER_NOT_IN_CHURCH', 403 );
        }

        // Atualiza dados do perfil
        let updatedProfile = await profileService.setProfileById(
            {
                ...profileFields,
                legalName: [ profileFields.firstName, profileFields.lastName ].filter(Boolean).join(' ')
            },
            userId
            );

        // Atualiza role se fornecido
        if ( role )
        {
            await userChurchRoleService.setOrCreateUserChurchRoleByProfileIdAndChurchId(
                churchId,
                userId,
                role
                );
        }

        return updatedProfile;
    }
}

// -- VARIABLES

export let updateChurchUserUseCase = new UpdateChurchUserUseCase(); 