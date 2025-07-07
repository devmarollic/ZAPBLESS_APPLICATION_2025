// -- IMPORTS

import { getRandomTuid, getRandomUuid, logError } from 'senselogic-gist';
import { Controller } from './controller';
import { profileService } from '../service/profile_service';
import { SupabaseStoreService } from '../service/supabase_store_service';
import { initWbot, getWbot } from '../../whatsapp_bot';
import { databaseService } from '../service/database_service';
import { whatsappService } from '../service/whatsapp_service';
import { isNullOrUndefined } from '../../base';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { whatsappBotManager } from '../../lib/service/whatsapp_bot_manager';
import { evolutionService } from '../service/evolution_service';
import { getIO } from '../../socket';

// -- TYPES

export class SyncWhatsappController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let profileLogged = request.profileLogged;

        if ( profileLogged === null )
        {
            throw new UnauthenticatedError();
        }

        let instanceArray = await evolutionService.getInstanceArray();
        let cachedInstanceArray = await evolutionService.getCachedInstanceArray();
        let churchId = profileLogged.user_metadata.church_id;
        let instanceAlreadyExists = instanceArray?.find( instance => instance.name === churchId );
        let response;

        if ( instanceAlreadyExists )
        {
            response = await evolutionService.getInstanceQrCode( instanceAlreadyExists.name );
        }
        else
        {
            let profile = await profileService.getProfileById( profileLogged.id );
            let instanceResponse = await evolutionService.createInstance(
                churchId,
                'WHATSAPP-BAILEYS',
                getRandomUuid(),
                [ profile.phonePrefix, profile.phoneNumber ].filter( Boolean ).join( '' ).trim().replace( /\D+/g, '' )
            );

            if ( instanceResponse && instanceResponse.instance )
            {
                response = await evolutionService.getInstanceQrCode(
                    instanceResponse.instance.instanceName
                    );
            }
            else
            {
                throw new Error( 'Failed to create WhatsApp instance' );
            }
        }

        return response;
    }   
}
