// -- IMPORTS

import { Server as SocketIO } from 'socket.io';
import pkg from 'jsonwebtoken';
import { AppError } from './lib/errors/app_error';
import { getJsonText, logError } from 'senselogic-gist';
import { supabaseService } from './lib/service/supabase_service';
import { enviroment } from './enviroment';

// -- VARIABLES

let io;
let verify = pkg.verify;

// -- FUNCTIONS

export function initIO(
    httpServer
    )
{
    io = new SocketIO(
        httpServer,
        {
            cors:
            {
                origin: enviroment.FRONTEND_URL
            }
        }
        );

    io.on(
        'connection',
        async ( socket ) =>
        {
            let { token } = socket.handshake.query;
            let tokenData = null;

            try
            {
                tokenData = verify( token, enviroment.ZAPBLESS_PROJECT_SUPABASE_JWT_SECRET );
                socket.userId = tokenData.sub;
            }
            catch ( error )
            {
                socket.disconnect();

                return io;
            }

            socket.on(
                'joinChurch',
                ( churchId ) =>
                {
                    socket.join( 'church_' + churchId );
                }
                );

            socket.on(
                'joinChatBox',
                ( ticketId ) =>
                {
                    socket.join( ticketId );
                }
                );

            socket.on(
                'joinNotification',
                ( sessionId ) =>
                {
                    socket.join( 'notification_' + sessionId );
                }
                );

            socket.on(
                'joinTickets',
                ( status ) =>
                {
                    socket.join( status );
                }
                );

            socket.on(
                'disconnect',
                () =>
                {
                    console.log( 'Client disconnected' );
                }
                );

            return socket;
        }
        );

    return io;
}

// ~~

export const getIO =
    () =>
    {
        if ( !io )
        {
            throw new AppError( 'Socket IO not initialized' );
        }

        return io;
    };