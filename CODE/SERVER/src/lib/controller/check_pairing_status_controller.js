// -- IMPORTS

import { churchService } from '../service/church_service.js';
import { dockerService } from '../service/docker_service.js';

// -- CONSTANTS

// -- TYPES

// -- VARIABLES

// -- FUNCTIONS

export class CheckPairingStatusController
{
    async handle(
        request,
        reply
    )
    {
        let { churchId } = request.params;

        try
        {
            console.log( 'Verificando status do pairing code para igreja:', churchId );

            // Verificar se a igreja existe
            let church = await churchService.getChurchById( churchId );
            if ( !church )
            {
                return reply.status( 404 ).send(
                    {
                        success: false,
                        message: 'Igreja não encontrada'
                    }
                );
            }

            // Verificar se o container está rodando
            let containerStatus = await dockerService.getContainerStatus( churchId );
            if ( !containerStatus.isRunning )
            {
                return reply.status( 400 ).send(
                    {
                        success: false,
                        message: 'Container WhatsApp não está rodando'
                    }
                );
            }

            // Construir URL do container
            let containerUrl = `http://192.168.15.7:${ containerStatus.port }`;

            // Verificar status do WhatsApp no container
            try
            {
                let response = await fetch( `${ containerUrl }/status` );
                if ( !response.ok )
                {
                    throw new Error( `HTTP ${ response.status }` );
                }

                let whatsappStatus = await response.json();

                return reply.status( 200 ).send(
                    {
                        success: true,
                        message: 'Status do WhatsApp obtido com sucesso',
                        status: whatsappStatus.status,
                        pairingCode: whatsappStatus.pairingCode,
                        qrCode: whatsappStatus.qrCode,
                        containerUrl: containerUrl
                    }
                );
            }
            catch ( error )
            {
                console.error( 'Erro ao verificar status do WhatsApp no container:', error );
                return reply.status( 500 ).send(
                    {
                        success: false,
                        message: 'Erro ao verificar status do WhatsApp no container'
                    }
                );
            }
        }
        catch ( error )
        {
            console.error( 'Erro ao verificar status do pairing code:', error );
            return reply.status( 500 ).send(
                {
                    success: false,
                    message: 'Erro interno do servidor'
                }
            );
        }
    }
}

// -- STATEMENTS 