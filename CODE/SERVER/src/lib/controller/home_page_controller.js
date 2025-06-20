// -- IMPORTS

import { SupabaseStoreService } from '../service/supabase_store_service';
import { PageController } from './page_controller';
import { getWbot } from '../../whatsapp_bot';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { profileService } from '../service/profile_service';
import { evolutionService } from '../service/evolution_service';

// -- TYPES

export class HomePageController extends PageController
{
    // -- OPERATIONS

    async processRequest(
        request,
        reply
        )
    {
        let profileLogged = request.profileLogged;

        if ( profileLogged === null )
        {
            throw new UnauthenticatedError();
        }

        let instanceArray = await evolutionService.getCachedInstanceArray();
        let instance = instanceArray.find( instance => instance.name === profileLogged.user_metadata.church_id );

        return (
            {
                whatsapp: instance
            }
            );
    }
}
