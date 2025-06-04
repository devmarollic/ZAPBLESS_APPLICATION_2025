// -- IMPORTS

import qrCode from 'qrcode-terminal';
import { Client, RemoteAuth } from 'whatsapp-web.js';
import { getIO } from './socket';
import { whatsappBotService } from './lib/service/whatsapp_bot_service';
import { getJsonObject, getRandomTuid, logError } from 'senselogic-gist';
import { AppError } from './lib/errors/app_error';
import { SupabaseStoreService } from './lib/service/supabase_store_service';
import { databaseService } from './lib/service/database_service';
import { whatsappBotManager } from './lib/service/whatsapp_bot_manager';
import { whatsappService } from './lib/service/whatsapp_service';
import { whatsappSessionService } from './lib/service/whatsapp_session_service';
import path from 'path';
import fs from 'fs';

// -- CONSTANTS

const sessionArray = [];

// -- FUNCTIONS

async function syncUnreadMessages(
    whatsappBot
    )
{
    let chatArray = await whatsappBot.getChats();

    for ( let chat of chatArray )
    {
        if ( chat.unreadCount > 0 )
        {
            let unreadMessages = await chat.fetchMessages(
                {
                    limit: chat.unreadCount
                }
                );

            for ( let message of unreadMessages )
            {
                await whatsappBotService.handleMessage( message, whatsappBot );
            }

            await chat.sendSeen();
        }
    }
};

// ~~

export async function initWbot(
    whatsapp
    )
{
    return new Promise(
        async ( resolve, reject ) =>
        {
            try
            {
                let io = getIO();
                let store = new SupabaseStoreService( { churchId: whatsapp.churchId } );

                let sessionName = whatsapp.name;
                let session;

                if ( whatsapp && whatsapp.session )
                {
                    session = getJsonObject( whatsapp.session );
                }

                let whatsappBot = new Client(
                    {
                        session: session,
                        authStrategy: new RemoteAuth(
                            {
                                clientId: whatsapp.id,
                                store,
                                backupSyncIntervalMs: 300000,
                                storeOptions: {
                                    useLocalStorage: false,
                                    useMemoryStorage: true
                                }
                            }
                            ),
                        puppeteer:
                            {
                                headless: true,
                                args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
                            }
                    }
                    );

                await whatsappBot.initialize();

                whatsappBot.on(
                    'qr',
                    async ( qr ) =>
                    {
                        qrCode.generate( qr, { small: true } );
                        
                        whatsapp.qrcode = qr;
                        whatsapp.status = 'qrcode';
                        whatsapp.retries = 0;

                        await whatsappService.setWhatsappById( whatsapp, whatsapp.id );
                        
                        let sessionIndex = sessionArray.findIndex( session => session.id === whatsapp.id );

                        if ( sessionIndex === -1 )
                        {
                            whatsappBot.id = whatsapp.id;
                            sessionArray.push( whatsappBot );
                        }

                        io.emit(
                            'whatsappSession',
                            {
                                action: 'update',
                                session: whatsapp
                            }
                            );
                    }
                    );

                whatsappBot.on(
                    'authenticated',
                    async () =>
                    {
                        console.log( `Session: ${ sessionName } AUTHENTICATED` );
                    }
                    );

                whatsappBot.on(
                    'auth_failure',
                    async ( message ) =>
                    {
                        console.error( `Session: ${ sessionName } AUTHENTICATION FAILURE! Reason: ${ message }` );

                        if ( whatsapp.retries > 1 ) 
                        {
                            whatsapp.session = '';
                            whatsapp.retries = 0;
                        }

                        whatsapp.status = 'DISCONNECTED';
                        whatsapp.retries += 1;

                        await whatsappService.setWhatsappById( whatsapp, whatsapp.id );

                        io.emit(
                            'whatsappSession',
                            {
                                action: 'update',
                                session: whatsapp
                            }
                            );

                        reject( new Error( 'Error starting whatsapp session.' ) );
                    }
                    );

                whatsappBot.on(
                    'ready',
                    async () =>
                    {
                        console.log( `Session: ${ sessionName } READY` );

                        whatsapp.status = 'CONNECTED';
                        whatsapp.qrcode = '';
                        whatsapp.retries = 0;

                        await whatsappService.setWhatsappById( whatsapp, whatsapp.id );

                        io.emit(
                            'whatsappSession',
                            {
                                action: 'update',
                                session: whatsapp
                            }
                            );

                        let sessionIndex = sessionArray.findIndex( session => session.id === whatsapp.id );

                        if ( sessionIndex === -1 )
                        {
                            whatsappBot.id = whatsapp.id;
                            sessionArray.push( whatsappBot );
                        }

                        whatsappBot.sendPresenceAvailable();
                        await syncUnreadMessages( whatsappBot );

                        resolve( whatsappBot );
                    }
                    );

                whatsappBot.on(
                    'remote_session_saved',
                    async () =>
                    {
                        console.log( `Session: ${ whatsappBot.authStrategy.sessionName } SAVED TO SUPABASE` );
                        
                        let session = await store.extract( { session: whatsappBot.authStrategy.sessionName } );

                        if ( session )
                        {
                            console.log( { session } );
                            
                            await databaseService
                                .getClient()
                                .from( 'WHATSAPP' )
                                .update( { session: session } )
                                .eq( 'id', whatsapp.id );
                        }
                        else
                        {
                            console.error( 'Failed to extract session data' );
                        }
                    }
                    );
            }
            catch ( error )
            {
                logError( error );
            }
        }
        );
};

// ~~

export async function getWbot(
    whatsapp
    )
{
    let bot = await whatsappBotManager.getBotInstance( whatsapp.churchId );

    return bot;
};

// ~~

export function removeWbot(
    whatsappId
    )
{
    try
    {
        let sessionIndex = sessionArray.findIndex( session => session.id === whatsappId );

        if ( sessionIndex !== -1 )
        {
            sessionArray[ sessionIndex ]._client.destroy();
            sessionArray.splice( sessionIndex, 1 );
        }
    }
    catch ( error )
    {
        console.error( error );
    }
};