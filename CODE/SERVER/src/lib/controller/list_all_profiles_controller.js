// -- IMPORTS

import { logError } from 'senselogic-gist';
import { profileService } from '../service/profile_service';
import { Controller } from './controller';

// -- FUNCTIONS

export class ListAllProfilesController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        try
        {
            let profileArray = await profileService.getAllProfiles();

            return reply.status( 200 ).send(
                {
                    success: true,
                    message: 'Profiles retrieved successfully',
                    data: {
                        profileArray,
                        count: profileArray?.length || 0
                    }
                }
                );
        }
        catch ( error )
        {
            logError( error );

            return reply.status( 500 ).send(
                {
                    success: false,
                    message: error.message || 'Internal server error',
                    data: null
                }
                );
        }
    }
} 