// -- IMPORTS

import { Controller } from './controller';
import { dockerService } from '../service/docker_service';
import { z } from 'zod';
import { isNullOrUndefined } from '../../base';
import { UnauthenticatedError } from '../errors/unauthenticated_error';

// -- CONSTANTS

const startContainerSchema = z.object(
    {
        churchId: z.string().min( 1, 'Church ID é obrigatório' )
    }
    );

const getLogsSchema = z.object(
    {
        churchId: z.string().min( 1, 'Church ID é obrigatório' ),
        lines: z.number().min( 1 ).max( 1000 ).default( 50 )
    }
    );

// -- TYPES

export class DockerContainerController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let profileLogged = request.profileLogged;

        if ( isNullOrUndefined( profileLogged ) )
        {
            throw new UnauthenticatedError();
        }

        let churchId = profileLogged.user_metadata.church_id;

        let { success, error, data } = await startContainerSchema.safeParseAsync( { churchId } );

        if ( !success )
        {
            return reply.status( 400 ).send(
                {
                    success: false,
                    message: 'Dados inválidos',
                    errors: error.errors
                }
                );
        }

        let result = await dockerService.startWhatsAppContainer( data.churchId );

        if ( result.success )
        {
            let containerUrl = `http://192.168.15.7:${ result.port }`;
            
            return reply.status( 200 ).send(
                {
                    ...result,
                    containerUrl
                }
                );
        }
        else
        {
            return reply.status( 500 ).send( result );
        }
    }
}

// ~~

export class StopDockerContainerController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let { params } = request;
        let { churchId } = params;

        if ( !churchId )
        {
            return reply.status( 400 ).send(
                {
                    success: false,
                    message: 'Church ID é obrigatório'
                }
                );
        }

        let result = await dockerService.stopWhatsAppContainer( churchId );

        return reply.status( 200 ).send( result );
    }
}

// ~~

export class RestartDockerContainerController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let { params } = request;
        let { churchId } = params;

        if ( !churchId )
        {
            return reply.status( 400 ).send(
                {
                    success: false,
                    message: 'Church ID é obrigatório'
                }
                );
        }

        let result = await dockerService.restartWhatsAppContainer( churchId );

        if ( result.success )
        {
            return reply.status( 200 ).send( result );
        }
        else
        {
            return reply.status( 500 ).send( result );
        }
    }
}

// ~~

export class GetDockerContainerLogsController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let { params, query } = request;
        let { churchId } = params;
        let { lines } = query;

        if ( !churchId )
        {
            return reply.status( 400 ).send(
                {
                    success: false,
                    message: 'Church ID é obrigatório'
                }
                );
        }

        let logsData = {
            churchId,
            lines: lines ? parseInt( lines ) : 50
        };

        let { success, error, data } = await getLogsSchema.safeParseAsync( logsData );

        if ( !success )
        {
            return reply.status( 400 ).send(
                {
                    success: false,
                    message: 'Parâmetros inválidos',
                    errors: error.errors
                }
                );
        }

        let result = await dockerService.getContainerLogs( data.churchId, data.lines );

        return reply.status( 200 ).send( result );
    }
}

// ~~

export class GetDockerContainerStatusController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let { params } = request;
        let { churchId } = params;

        if ( !churchId )
        {
            return reply.status( 400 ).send(
                {
                    success: false,
                    message: 'Church ID é obrigatório'
                }
                );
        }

        let containerName = `zapbless-whatsapp-${ churchId }`;
        let isRunning = await dockerService.isContainerRunning( containerName );
        let status = await dockerService.getContainerStatus( containerName );
        let port = dockerService.getPortForChurch( churchId );

        return reply.status( 200 ).send(
            {
                success: true,
                churchId,
                containerName,
                isRunning,
                status,
                port
            }
            );
    }
}

// ~~

export class ListDockerContainersController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let activeContainers = dockerService.getActiveContainers();

        let containersInfo = [];

        for ( const [ churchId, containerName ] of activeContainers )
        {
            let isRunning = await dockerService.isContainerRunning( containerName );
            let status = await dockerService.getContainerStatus( containerName );
            let port = dockerService.getPortForChurch( churchId );

            containersInfo.push(
                {
                    churchId,
                    containerName,
                    isRunning,
                    status,
                    port
                }
                );
        }

        return reply.status( 200 ).send(
            {
                success: true,
                containers: containersInfo
            }
            );
    }
} 