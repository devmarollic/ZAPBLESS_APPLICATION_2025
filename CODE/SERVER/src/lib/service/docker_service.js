// -- IMPORTS

import { exec } from 'child_process';
import { promisify } from 'util';
import { logError } from 'senselogic-gist';

// -- CONSTANTS

const execAsync = promisify( exec );

// -- TYPES

class DockerService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.activeContainers = new Map();
    }

    // -- INQUIRIES

    async isContainerRunning(
        containerName
        )
    {
        try
        {
            let { stdout } = await execAsync(
                `docker ps --filter "name=${ containerName }" --format "{{.Names}}"`
                );

            return stdout.trim() === containerName;
        }
        catch ( error )
        {
            logError( `Error checking container status for ${ containerName }:`, error );
            return false;
        }
    }

    // ~~

    async getContainerStatus(
        containerName
        )
    {
        try
        {
            let { stdout } = await execAsync(
                `docker ps -a --filter "name=${ containerName }" --format "{{.Status}}"`
                );

            return stdout.trim();
        }
        catch ( error )
        {
            logError( `Error getting container status for ${ containerName }:`, error );
            return 'UNKNOWN';
        }
    }

    // -- OPERATIONS

    async startWhatsAppContainer(
        churchId
        )
    {
        let containerName = `zapbless-whatsapp-${ churchId }`;
        let imageName = 'zapbless-whatsapp-manager:latest';
        let port = this.getPortForChurch( churchId );

        try
        {
            // Check if container already exists and is running
            let isRunning = await this.isContainerRunning( containerName );

            if ( isRunning )
            {
                return (
                    {
                        success: true,
                        message: 'Container já está em execução',
                        containerName,
                        port
                    }
                    );
            }

            // Stop and remove existing container if it exists
            await this.stopWhatsAppContainer( churchId );

            // Start new container
            let dockerCommand = `docker run -d \
                --name ${ containerName } --network zapbless_net \
                -p ${ port }:1234 \
                -e CHURCH_ID=${ churchId } \
                -e NODE_ENV=production \
                -e RABBITMQ_URL=amqp://zapbless:superS3cret@rabbitmq:5672/ \
                -e SUPABASE_DATABASE_URL=https://vmpwbxbfrrpzcaeuhtba.supabase.co \
                -e SUPABASE_DATABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtcHdieGJmcnJwemNhZXVodGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MDk4MjQsImV4cCI6MjA2Mjk4NTgyNH0.c1lhGi0kugi_KdcjGCuZrhrSC6WBs514iMjghNMgVIs \
                -e PORT=1234 \
                -e SESSION_ID=session-${ churchId } \
                -e SESSION_DIR=./data \
                -e DEBUG=false \
                -e RABBITMQ_OUTBOUND_QUEUE=zapbless.outbound \
                -e RABBITMQ_INBOUND_QUEUE=zapbless.inbound \
                -e RABBITMQ_DISCONNECTED_SESSIONS_QUEUE=zapbless.disconnected.sessions \
                --restart unless-stopped \
                ${ imageName }`;

            let { stdout, stderr } = await execAsync( dockerCommand );

            if ( stderr && !stderr.includes( 'WARNING' ) )
            {
                throw new Error( stderr );
            }

            this.activeContainers.set( churchId, containerName );

            return (
                {
                    success: true,
                    message: 'Container iniciado com sucesso',
                    containerName,
                    port,
                    containerId: stdout.trim()
                }
                );
        }
        catch ( error )
        {
            logError( `Error starting WhatsApp container for church ${ churchId }:`, error );
            
            return (
                {
                    success: false,
                    message: 'Erro ao iniciar container',
                    error: error.message
                }
                );
        }
    }

    // ~~

    async stopWhatsAppContainer(
        churchId
        )
    {
        let containerName = `zapbless-whatsapp-${ churchId }`;

        try
        {
            // Stop container
            await execAsync( `docker stop ${ containerName }` );
            
            // Remove container
            await execAsync( `docker rm ${ containerName }` );

            this.activeContainers.delete( churchId );

            return (
                {
                    success: true,
                    message: 'Container parado e removido com sucesso'
                }
                );
        }
        catch ( error )
        {
            // Container might not exist, which is fine
            if ( !error.message.includes( 'No such container' ) )
            {
                logError( `Error stopping WhatsApp container for church ${ churchId }:`, error );
            }

            this.activeContainers.delete( churchId );

            return (
                {
                    success: true,
                    message: 'Container não estava em execução'
                }
                );
        }
    }

    // ~~

    async restartWhatsAppContainer(
        churchId
        )
    {
        await this.stopWhatsAppContainer( churchId );
        return await this.startWhatsAppContainer( churchId );
    }

    // ~~

    async getContainerLogs(
        churchId,
        lines = 50
        )
    {
        let containerName = `zapbless-whatsapp-${ churchId }`;

        try
        {
            let { stdout } = await execAsync(
                `docker logs --tail ${ lines } ${ containerName }`
                );

            return (
                {
                    success: true,
                    logs: stdout
                }
                );
        }
        catch ( error )
        {
            logError( `Error getting container logs for church ${ churchId }:`, error );
            
            return (
                {
                    success: false,
                    message: 'Erro ao obter logs do container',
                    error: error.message
                }
                );
        }
    }

    // ~~

    getPortForChurch(
        churchId
        )
    {
        // Generate a unique port for each church
        // Starting from 3001 to avoid conflicts
        let hash = 0;
        
        for ( let i = 0; i < churchId.length; i++ )
        {
            let char = churchId.charCodeAt( i );
            hash = ( ( hash << 5 ) - hash ) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }

        return 3001 + ( Math.abs( hash ) % 1000 );
    }

    // ~~

    getActiveContainers(
        )
    {
        return Array.from( this.activeContainers.entries() );
    }
}

// -- VARIABLES

export let dockerService
    = new DockerService(); 