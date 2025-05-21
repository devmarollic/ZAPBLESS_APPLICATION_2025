// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { PageController } from './page_controller';
import { getIO } from '../../socket';
import { Client, RemoteAuth } from 'whatsapp-web.js';
import { MongoStore } from 'wwebjs-mongo';
import mongoose from 'mongoose';
import { getWbot } from '../../whatsapp_bot';

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

        let whatsapp = await getWbot( request.profileLogged.id );

        return (
            {
                whatsapp
            }
            );
    }
}
