// -- IMPORTS

import qrCode from 'qrcode-terminal';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { getIO } from './socket';
import Whatsapp from '../models/Whatsapp';
import AppError from '../errors/app_error';
import { whatsappBotService } from './lib/service/whatsapp_bot_service';
import { getJsonObject } from 'senselogic-gist';

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
        ( resolve, reject ) =>
        {
            try
            {
                let io = getIO();
                let sessionName = whatsapp.name;
                let sessionCfg;

                if ( whatsapp && whatsapp.session )
                {
                    sessionCfg = getJsonObject( whatsapp.session );
                }

                let argumentArray = process.env.CHROME_ARGS || '';

                let whatsappBot = new Client(
                    {
                        session: sessionCfg,
                        authStrategy: new LocalAuth( { clientId: 'bd_' + whatsapp.id } ),
                        puppeteer:
                            {
                                executablePath: process.env.CHROME_BIN || undefined,
                                browserWSEndpoint: process.env.CHROME_WS || undefined,
                                args: argumentArray.split( '  ' )
                            }
                    }
                    );

                whatsappBot.initialize();

                whatsappBot.on(
                    'qr',
                    async ( qr ) =>
                    {
                        console.log( 'Session:', sessionName );
                        qrCode.generate( qr, { small: true } );
                        await whatsapp.update( { qrcode: qr, status: 'qrcode', retries: 0 } );

                        let sessionIndex = sessionArray.findIndex( session => session.id === whatsapp.id );

                        if ( sessionIndex === -1 )
                        {
                            whatsappBot.id = whatsapp.id;
                            sessionArray.push( whatsappBot );
                        }

                        io
                            .to( 'church_' + whatsapp.churchId )
                            .emit(
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
                    async ( session ) =>
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
                            await whatsapp.update(
                                {
                                    session: '',
                                    retries: 0
                                }
                                );
                        }

                        let retry = whatsapp.retries;

                        await whatsapp.update(
                            {
                                status: 'DISCONNECTED',
                                retries: retry + 1
                            }
                            );

                        io
                            .to( 'church_' + whatsapp.churchId )
                            .emit(
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

                        await whatsapp.update(
                            {
                                status: 'CONNECTED',
                                qrcode: '',
                                retries: 0
                            }
                            );

                        io
                            .to( 'church_' + whatsapp.churchId )
                            .emit(
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
            }
            catch ( error )
            {
                console.error( error );
            }
        }
        );
};

// ~~

export function getWbot(
    whatsappId
    )
{
    let sessionIndex = sessionArray.findIndex( session => session.id === whatsappId );

    if ( sessionIndex === -1 )
    {
        throw new AppError( 'ERR_WAPP_NOT_INITIALIZED' );
    }

    return sessionArray[ sessionIndex ];
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