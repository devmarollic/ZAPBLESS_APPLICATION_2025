// -- IMPORTS

import { getRandomTuid, logError } from 'senselogic-gist';
import { PageController } from './page_controller';
import { getIO } from '../../socket';
import { whatsappBotManager } from '../../lib/service/whatsapp_bot_manager';
import { databaseService } from '../service/database_service';
import { profileService } from '../service/profile_service';
import { whatsappService } from '../service/whatsapp_service';
import { initWbot } from '../../whatsapp_bot';
import { whatsappBotService } from '../service/whatsapp_bot_service';
import { StatusCodes } from 'http-status-codes';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { churchService } from '../service/church_service';
import { ministryService } from '../service/ministry_service';
import { evolutionService } from '../service/evolution_service';

// -- TYPES

export class DashboardPageController extends PageController
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

        let churchId = profileLogged.user_metadata.church_id;
        let [
                whatsappInstanceArray,
                church,
                ministryArray,
                membersTotalQuery,
                membersGrowthQuery,
                messagesTotalQuery,
                messagesGrowthQuery,
                ministriesTotalQuery,
                ministriesGrowthQuery,
                announcementsTotalQuery,
                announcementsGrowthQuery,
                contactTotalQuery,
                contactGrowthQuery
            ] = await Promise.all(
                [
                    evolutionService.getCachedInstanceArray(),
                    churchService.getChurchById( churchId ),
                    ministryService.getMinistriesByChurchId( churchId ),
                    databaseService.getClient()
                        .from( 'CONTACT' )
                        .select( 'id' )
                        .eq( 'churchId', churchId ),
                    databaseService.getClient()
                        .from( 'CONTACT' )
                        .select( 'id' )
                        .eq( 'churchId', churchId )
                        .gte( 'creationTimestamp', new Date( new Date().getFullYear(), new Date().getMonth(), 1 ).toISOString() ),
                    databaseService.getClient()
                        .from( 'MESSAGE' )
                        .select( 'id' )
                        .eq( 'churchId', churchId ),
                    databaseService.getClient()
                        .from( 'MESSAGE' )
                        .select( 'id' )
                        .eq( 'churchId', churchId )
                        .gte( 'created_at', new Date( new Date().getFullYear(), new Date().getMonth(), 1 ).toISOString() ),
                    databaseService.getClient()
                        .from( 'MINISTRY' )
                        .select( 'id' )
                        .eq( 'churchId', churchId ),
                    databaseService.getClient()
                        .from( 'MINISTRY' )
                        .select( 'id' )
                        .eq( 'churchId', churchId )
                        .gte( 'creationTimestamp', new Date( new Date().getFullYear(), new Date().getMonth(), 1 ).toISOString() ),
                    databaseService.getClient()
                        .from( 'ANNOUNCEMENT' )
                        .select( 'id' )
                        .eq( 'churchId', churchId ),
                    databaseService.getClient()
                        .from( 'ANNOUNCEMENT' )
                        .select( 'id' )
                        .eq( 'churchId', churchId )
                        .gte( 'creationTimestamp', new Date( new Date().getFullYear(), new Date().getMonth(), 1 ).toISOString() ),
                    databaseService.getClient()
                        .from( 'CONTACT' )
                        .select( 'id' )
                        .eq( 'churchId', churchId ),
                    databaseService.getClient()
                        .from( 'CONTACT' )
                        .select( 'id' )
                        .eq( 'churchId', churchId )
                        .gte( 'creationTimestamp', new Date( new Date().getFullYear(), new Date().getMonth(), 1 ).toISOString() )
                ]
                );

        let membersTotal = membersTotalQuery?.data?.length ?? 0 + contactTotalQuery?.data?.length ?? 0;
        let membersGrowth = membersGrowthQuery?.data?.length ?? 0 + contactGrowthQuery?.data?.length ?? 0;

        let messagesTotal = messagesTotalQuery?.data?.length ?? 0;
        let messagesGrowth = messagesGrowthQuery?.data?.length ?? 0;

        let ministriesTotal = ministriesTotalQuery?.data?.length ?? 0;
        let ministriesGrowth = ministriesGrowthQuery?.data?.length ?? 0;

        let announcementsTotal = announcementsTotalQuery?.data?.length ?? 0;
        let announcementsGrowth = announcementsGrowthQuery?.data?.length ?? 0;

        let whatsapp = whatsappInstanceArray?.find( instance => instance.name === profileLogged.user_metadata.church_id );

        return (
            {
                whatsapp,
                church,
                ministryArray,
                metrics:
                    {
                        members:
                            {
                                total: membersTotal,
                                growth: membersGrowth
                            },
                        messages:
                            {
                                total: messagesTotal,
                                growth: messagesGrowth
                            },
                        ministries:
                            {
                                total: ministriesTotal,
                                growth: ministriesGrowth
                            },
                        announcements:
                            {
                                total: announcementsTotal,
                                growth: announcementsGrowth
                            }
                    }
            }
            );
    }
}
