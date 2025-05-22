// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { getIO } from '../../socket';
import { Client, RemoteAuth } from 'whatsapp-web.js';
import { Controller } from './controller';
import { SupabaseStoreService } from '../service/supabase_store_service';
import { churchService } from '../service/church_service';
import { profileService } from '../service/profile_service';

// -- CONSTANTS

const sessionArray = [];

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

        let userId = request.profileLogged.id;
        let profile = await profileService.getProfileById( userId );
        console.log( 'CHURCH ID: ', profile.churchId );
        let io = getIO();

        let whatsappBot = new Client(
            {
                authStrategy: new RemoteAuth(
                    {
                        sessionName: 'church_' + profile.churchId,
                        clientId: userId,
                        store: new SupabaseStoreService(
                            {
                                churchId: profile.churchId
                            }
                            ),
                        backupSyncIntervalMs: 300000
                    }
                    ),
                puppeteer:
                    {
                        headless: true,
                        args: [ '--no-sandbox' ]
                    }
            }
            );
        let whatsapp = 
            {
                id: whatsappBot.id,
                name: '',
                session: getRandomTuid(),
                qrcode: '',
                status: 'OPENING',
                battery: '100',
                plugged: false,
                retries: 0,
                greetingMessage: 'Olá',
                farewellsMessage: 'Até mais',
                isDefault: true,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        // let whatsappBot = new Client(
        //     {
        //         authStrategy: new LocalAuth( { clientId: 'bd_' + whatsapp.id } ),
        //         puppeteer:
        //             {
        //                 headless: true,
        //                 args: ['--no-sandbox']
        //             }
        //     }
        //     );

        whatsappBot.initialize();

        whatsappBot.on(
            'qr',
            async ( qr ) =>
            {
                whatsapp =
                    {
                        ...whatsapp,
                        qrcode: qr,
                        status: 'qrcode',
                        retries: 0
                    };

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
            async ( session ) =>
            {
                console.log( `Session: ${ session } AUTHENTICATED` );
            }
            );

        whatsappBot.on(
            'auth_failure',
            async ( message ) =>
            {
                console.error( `Session: ${ whatsapp.session } AUTHENTICATION FAILURE! Reason: ${ message }` );

                if ( whatsapp.retries > 1 ) 
                {
                    whatsapp.session = '';
                    whatsapp.retries = 0;
                }

                let retry = whatsapp.retries;

                whatsapp.status = 'DISCONNECTED';
                whatsapp.retries = retry + 1;

                io.emit(
                    'whatsappSession',
                    {
                        action: 'update',
                        session: whatsapp
                    }
                    );

                throw new Error( 'Error starting whatsapp session.' );
                // reject( new Error( 'Error starting whatsapp session.' ) );
            }
            );

        whatsappBot.on(
            'ready',
            async () =>
            {
                console.log( `Session: ${ whatsapp.session } READY` );

                console.log( whatsappBot );

                whatsapp.status = 'CONNECTED',
                whatsapp.qrcode = '';
                whatsapp.retries = 0;

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

                // resolve( whatsappBot );
            }
            );
        whatsappBot.on('remote_session_saved', ( data ) => {
            console.log( 'SESSÃO SALVA COM SUCESSO ', data );
        }); 

        return (
            {
                success: true,
                whatsapp
            }
            );
    }
}
