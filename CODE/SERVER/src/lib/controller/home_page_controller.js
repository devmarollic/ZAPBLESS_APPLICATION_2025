// -- IMPORTS

import { SupabaseStoreService } from '../service/supabase_store_service';
import { PageController } from './page_controller';
import { getWbot } from '../../whatsapp_bot';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { profileService } from '../service/profile_service';

// -- TYPES

export class HomePageController extends PageController
{
    // -- OPERATIONS

    async processRequest(
        request,
        reply
        )
    {
        if ( request.profileLogged === null )
        {
            throw new UnauthenticatedError();
        }

        let profile = await profileService.getProfileById( request.profileLogged.id );
        let whatsapp = await getWbot( request.profileLogged.id, profile.churchId );

        return (
            {
                whatsapp
            }
            );
    }
}
