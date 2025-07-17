// -- IMPORTS

import { Controller } from './controller';
import { dockerService } from '../service/docker_service';
import { isNullOrUndefined } from '../../base';
import { UnauthenticatedError } from '../errors/unauthenticated_error';

// -- TYPES

export class SyncWhatsappContainerController extends Controller
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

        try
        {
            // Iniciar container Docker para a igreja
            let result = await dockerService.startWhatsAppContainer( churchId );

            if ( result.success )
            {
                // Construir URL do container
                let containerUrl = `http://192.168.15.7:${ result.port }`;
                
                // Aguardar um pouco para o container inicializar
                await new Promise( resolve => setTimeout( resolve, 2000 ) );

                return reply.status( 200 ).send(
                    {
                        success: true,
                        message: 'Container iniciado com sucesso',
                        containerUrl,
                        port: result.port,
                        containerName: result.containerName,
                        churchId
                    }
                    );
            }
            else
            {
                return reply.status( 500 ).send(
                    {
                        success: false,
                        message: 'Erro ao iniciar container',
                        error: result.error
                    }
                    );
            }
        }
        catch ( error )
        {
            return reply.status( 500 ).send(
                {
                    success: false,
                    message: 'Erro interno do servidor',
                    error: error.message
                }
                );
        }
    }
} 