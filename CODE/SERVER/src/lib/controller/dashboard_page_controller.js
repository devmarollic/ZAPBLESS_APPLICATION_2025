// -- IMPORTS

import { getRandomTuid, logError } from 'senselogic-gist';
import { PageController } from './page_controller';
import { getIO } from '../../socket';
import { whatsappBotManager } from '../../lib/service/whatsapp_bot_manager';
import { databaseService } from '../service/database_service';
import { StatusCodes } from 'http-status-codes';
import { profileService } from '../service/profile_service';
import { whatsappService } from '../service/whatsapp_service';
import { initWbot } from '../../whatsapp_bot';
import { whatsappBotService } from '../service/whatsapp_bot_service';

// -- TYPES

export class DashboardPageController extends PageController
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

        // let profile = await profileService.getProfileById( request.profileLogged.id );

        // const { data: whatsapp, error: fetchError } = await databaseService
        //     .getClient()
        //     .from( 'WHATSAPP' )
        //     .select( '*' )
        //     .eq( 'churchId', profile.churchId )
        //     .single();

        // if ( whatsapp )
        // {
        //     whatsappBotService.startWhatsAppSession( whatsapp );
        // }


        return reply.status( StatusCodes.NO_CONTENT ).send();
    }
}
