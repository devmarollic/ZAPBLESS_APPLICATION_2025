// -- IMPORTS

import { profileService } from '../service/profile_service';
import { z } from 'zod';

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

        let validatedInput = inputSchema.parse( input );

        let result = await profileService.getProfileArrayByChurchIdWithFilters(
            validatedInput.churchId,
            {
                searchTerm: validatedInput.searchTerm,
                statusFilter: validatedInput.statusFilter,
                roleFilter: validatedInput.roleFilter,
                page: validatedInput.page,
                limit: validatedInput.limit
            }
            );

        return result;
    }
}

// -- VARIABLES

export let listChurchUsersWithFiltersUseCase = new ListChurchUsersWithFiltersUseCase(); 