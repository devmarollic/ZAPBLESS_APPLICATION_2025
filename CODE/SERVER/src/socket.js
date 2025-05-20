// -- IMPORTS

import { Server as SocketIO } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { AppError } from './lib/errors/app_error';
import { getJsonText, logError } from 'senselogic-gist';

// -- VARIABLES

let io;

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
                origin: process.env.FRONTEND_URL
            }
        }
        );

    io.on(
        'connection',
        ( socket ) =>
        {
            let { token } = socket.handshake.query;
            let tokenData = null;

            try
            {
                tokenData = verify( token, process.env.ZAPBLESS_PROJECT_SUPABASE_JWT_SECRET );
                console.log( getJsonText( tokenData ), 'io-onConnection: tokenData' );
            }
            catch ( error )
            {
                logError( getJsonText( error ), 'Error decoding token' );
                socket.disconnect();

                return io;
            }

            console.log( 'Client Connected' );

            socket.on(
                'joinChatBox',
                ( ticketId ) =>
                {
                    console.log( 'A client joined a ticket channel' );
                    socket.join( ticketId );
                }
                );

            socket.on(
                'joinNotification',
                () =>
                {
                    console.log( 'A client joined notification channel' );
                    socket.join( 'notification' );
                }
                );

            socket.on(
                'joinTickets',
                ( status ) =>
                {
                    console.log( `A client joined to ${ status } tickets channel.` );
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