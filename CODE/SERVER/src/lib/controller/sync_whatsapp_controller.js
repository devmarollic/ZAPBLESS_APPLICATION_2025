// -- IMPORTS

import { getRandomTuid, logError } from 'senselogic-gist';
import { Controller } from './controller';
import { profileService } from '../service/profile_service';
import { SupabaseStoreService } from '../service/supabase_store_service';
import { initWbot, getWbot } from '../../whatsapp_bot';
import { databaseService } from '../service/database_service';
import { whatsappService } from '../service/whatsapp_service';
import { isNullOrUndefined } from '../../base';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { whatsappBotManager } from '../../lib/service/whatsapp_bot_manager';

// -- TYPES

export class SyncWhatsappController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        if ( request.profileLogged === null )
        {
            throw new UnauthenticatedError();
        }

        try {
            let userId = request.profileLogged.id;
            let profile = await profileService.getProfileById( userId );

            let whatsapp = await whatsappService.getWhatsappByChurchId( profile.churchId );

            if ( isNullOrUndefined( whatsapp ) )
            {
                whatsapp = await whatsappService.addWhatsapp(
                    {
                        id: getRandomTuid(),
                        name: 'church_' + profile.churchId,
                        qrcode: '',
                        status: 'OPENING',
                        battery: '100',
                        isPlugged: false,
                        retries: 0,
                        greetingMessage: 'Olá',
                        farewellsMessage: 'Até mais',
                        isDefault: true,
                        churchId: profile.churchId
                    }
                    );
            }

            let bot = await whatsappBotManager.getBotInstance(profile.churchId);
            
            if (!bot) {
                bot = await initWbot(whatsapp);
            }

            await whatsappService.setWhatsappById(
                {
                    ...whatsapp,
                    status: bot ? 'CONNECTED' : 'OPENING'
                },
                whatsapp.id
            );

            return {
                success: true,
                whatsapp: {
                    ...whatsapp,
                    status: bot ? 'CONNECTED' : 'OPENING'
                }
            };
        } catch (error) {
            logError('Error in sync whatsapp:', error);
            throw error;
        }
    }   
}
