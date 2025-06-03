// -- IMPORTS
import { initWbot, getWbot } from '../../whatsapp_bot';
import { databaseService } from './database_service';
import { getIO } from '../../socket';
import { logError } from 'senselogic-gist';
import { whatsappService } from './whatsapp_service';
import { isNullOrUndefined } from '../../base';

// -- TYPES

export class WhatsappBotManager
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.botInstances = new Map();
    }

    // -- INQUIRIES

    async initializeAllSessions(
        )
    {
        let { data: whatsapps, error } = await databaseService
            .getClient()
            .from( 'WHATSAPP' )
            .select( '*' );

        if ( error !== null )
        {
            return;
        }

        for ( const whatsapp of whatsapps )
        {
            await this.initializeSession( whatsapp );
            continue;
        }
    }

    // ~~

    getAllBotInstances(
        )
    {
        return Array.from(this.botInstances.entries());
    }

    // ~~

    async initializeSession(
        whatsapp
        )
    {
        try
        {
            if ( this.botInstances.has( whatsapp.churchId ) )
            {
                let existingBot = this.botInstances.get( whatsapp.churchId );

                if ( existingBot && existingBot.info )
                {
                    return existingBot;
                }

                this.removeBotInstance(whatsapp.churchId);
            }

            let bot = await initWbot( whatsapp );
            this.botInstances.set( whatsapp.churchId, bot );

            await whatsappService.setWhatsappById(
                {
                    ...whatsapp,
                    status: 'CONNECTED'
                },
                whatsapp.id
            );

            let io = getIO();
            io.emit(
                'whatsappSession',
                {
                    action: 'update',
                    session: whatsapp
                }
                );

            return bot;
        }
        catch ( error )
        {
            logError( `Error initializing session for church ${ whatsapp.churchId }:`, error );
            
            await whatsappService.setWhatsappById(
                {
                    ...whatsapp,
                    status: 'DISCONNECTED'
                },
                whatsapp.id
            );

            throw error;
        }
    }

    // ~~

    async getBotInstance(
        churchId
        )
    {
        try {
            // First check if we have an active instance
            if ( this.botInstances.has( churchId ) )
            {
                const bot = this.botInstances.get( churchId );
                // Verify if the bot is still connected
                if (bot && bot.info) {
                    return bot;
                }
                // If not connected, remove it
                this.removeBotInstance( churchId );
            }

            // If no active instance, try to get whatsapp data
            let whatsapp = await whatsappService.getWhatsappByChurchId( churchId );

            if ( isNullOrUndefined( whatsapp ) )
            {
                return null;
            }

            // Try to initialize a new session
            return await this.initializeSession( whatsapp );
        } catch (error) {
            logError(`Error getting bot instance for church ${churchId}:`, error);
            return null;
        }
    }

    // -- OPERATIONS

    removeBotInstance(
        churchId
        )
    {
        if ( this.botInstances.has( churchId ) )
        {
            try {
                let bot = this.botInstances.get( churchId );
                bot.destroy();
            } catch (error) {
                logError(`Error destroying bot instance for church ${churchId}:`, error);
            } finally {
                this.botInstances.delete( churchId );
            }
        }
    }
}

// -- VARIABLES

export const whatsappBotManager =
    new WhatsappBotManager(); 