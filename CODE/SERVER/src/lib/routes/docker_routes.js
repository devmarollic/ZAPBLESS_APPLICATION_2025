// -- IMPORTS

import { DockerContainerController } from '../controller/docker_container_controller';
import { StopDockerContainerController } from '../controller/docker_container_controller';
import { RestartDockerContainerController } from '../controller/docker_container_controller';
import { GetDockerContainerLogsController } from '../controller/docker_container_controller';
import { GetDockerContainerStatusController } from '../controller/docker_container_controller';
import { ListDockerContainersController } from '../controller/docker_container_controller';
import { SyncWhatsappContainerController } from '../controller/sync_whatsapp_container_controller';
import { CheckPairingStatusController } from '../controller/check_pairing_status_controller';

// -- CONSTANTS

const dockerContainerController = new DockerContainerController();
const stopDockerContainerController = new StopDockerContainerController();
const restartDockerContainerController = new RestartDockerContainerController();
const getDockerContainerLogsController = new GetDockerContainerLogsController();
const getDockerContainerStatusController = new GetDockerContainerStatusController();
const listDockerContainersController = new ListDockerContainersController();
const syncWhatsappContainerController = new SyncWhatsappContainerController();
const checkPairingStatusController = new CheckPairingStatusController();

// -- FUNCTIONS

export async function dockerRoutes(
    fastify,
    options
    )
{
    // Sincronizar WhatsApp (inicia container e retorna URL)
    fastify.post(
        '/sync',
        ( request, response ) => syncWhatsappContainerController.handle( request, response )
        );

    // Iniciar container Docker para uma igreja
    fastify.post(
        '/container/start',
        ( request, response ) => dockerContainerController.handle( request, response )
        );

    // Parar container Docker de uma igreja
    fastify.post(
        '/container/:churchId/stop',
        ( request, response ) => stopDockerContainerController.handle( request, response )
        );

    // Reiniciar container Docker de uma igreja
    fastify.post(
        '/container/:churchId/restart',
        ( request, response ) => restartDockerContainerController.handle( request, response )
        );

    // Obter logs do container Docker de uma igreja
    fastify.get(
        '/container/:churchId/logs',
        ( request, response ) => getDockerContainerLogsController.handle( request, response )
        );

    // Obter status do container Docker de uma igreja
    fastify.get(
        '/container/:churchId/status',
        ( request, response ) => getDockerContainerStatusController.handle( request, response )
        );

    // Listar todos os containers Docker ativos
    fastify.get(
        '/containers/list',
        ( request, response ) => listDockerContainersController.handle( request, response )
        );

    // Verificar status do pairing code do WhatsApp
    fastify.get(
        '/pairing/:churchId/status',
        ( request, response ) => checkPairingStatusController.handle( request, response )
        );
} 