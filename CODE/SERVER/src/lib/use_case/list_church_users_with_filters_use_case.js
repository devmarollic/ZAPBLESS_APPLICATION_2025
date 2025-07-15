// -- IMPORTS

import { profileService } from '../service/profile_service';
import { z, ZodError } from 'zod';

// -- TYPES

class ListChurchUsersWithFiltersUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        let inputSchema = z.object(
            {
                churchId: z.string().min( 1 ),
                searchTerm: z.string().optional(),
                statusFilter: z.string().optional(),
                roleFilter: z.string().optional(),
                page: z.number().min( 1 ).default( 1 ),
                limit: z.number().min( 1 ).max( 100 ).default( 10 )
            }
            );

        let { data, error, success } = inputSchema.safeParse( input );

        if ( !success )
        {
            throw new ZodError( error.message );
        }

        let result = await profileService.getProfileArrayByChurchIdWithFilters(
            data.churchId,
            {
                searchTerm: data.searchTerm,
                statusFilter: data.statusFilter,
                roleFilter: data.roleFilter,
                page: data.page,
                limit: data.limit
            }
            );

        return result;
    }
}

// -- VARIABLES

export let listChurchUsersWithFiltersUseCase = new ListChurchUsersWithFiltersUseCase(); 