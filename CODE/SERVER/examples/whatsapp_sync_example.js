// -- IMPORTS

import fetch from 'node-fetch';
import { getJsonText } from 'senselogic-gist';

// -- CONSTANTS

const BASE_URL = 'http://localhost:3000';

// -- FUNCTIONS

async function syncWhatsApp(
    )
{
    console.log( '=== Sincronização WhatsApp ===\n' );

    try
    {
        // 1. Iniciar container e obter URL
        console.log( '1. Iniciando container WhatsApp...' );
        let response = await fetch(
            `${ BASE_URL }/docker/sync`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE'
                }
            }
            );

        let result = await response.json();
        console.log( 'Resultado da sincronização:', result );

        if ( result.success )
        {
            console.log( `✅ Container iniciado com sucesso!` );
            console.log( `📱 URL do container: ${ result.containerUrl }` );
            console.log( `🔌 Porta: ${ result.port }` );
            console.log( `🏷️ Nome do container: ${ result.containerName }` );
            console.log( `⛪ Church ID: ${ result.churchId }` );

            // 2. Aguardar container inicializar
            console.log( '\n2. Aguardando container inicializar...' );
            await new Promise( resolve => setTimeout( resolve, 5000 ) );

            // 3. Verificar status do WhatsApp
            console.log( '\n3. Verificando status do WhatsApp...' );
            let statusResponse = await fetch( `${ result.containerUrl }/status` );
            let status = await statusResponse.json();
            console.log( 'Status do WhatsApp:', status );

            // 4. Se estiver conectando, mostrar QR Code
            if ( status.status === 'connecting' && status.qrCode )
            {
                console.log( '\n4. QR Code disponível!' );
                console.log( `📱 QR Code URL: ${ result.containerUrl }${ status.qrCode }` );
                console.log( '📱 Escaneie o QR Code com seu WhatsApp para conectar.' );
            }
            else if ( status.status === 'open' )
            {
                console.log( '\n4. ✅ WhatsApp já está conectado!' );
            }
            else
            {
                console.log( '\n4. ⚠️ Status inesperado:', status.status );
            }

            // 5. Exemplo de envio de mensagem (se conectado)
            if ( status.status === 'open' )
            {
                console.log( '\n5. Enviando mensagem de teste...' );
                let messageResponse = await fetch(
                    `${ result.containerUrl }/send/text`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: getJsonText(
                            {
                                to: '5511999999999',
                                text: 'Teste de mensagem do ZapBless!'
                            }
                            )
                    }
                    );

                let messageResult = await messageResponse.json();
                console.log( 'Resultado do envio:', messageResult );
            }

            return result;
        }
        else
        {
            console.error( '❌ Erro ao iniciar container:', result.message );
            return null;
        }
    }
    catch ( error )
    {
        console.error( '❌ Erro durante sincronização:', error );
        return null;
    }
}

// ~~

async function checkContainerStatus(
    churchId
    )
{
    console.log( `\n=== Verificando Status do Container ${ churchId } ===\n` );

    try
    {
        let response = await fetch(
            `${ BASE_URL }/docker/container/${ churchId }/status`
            );

        let result = await response.json();
        console.log( 'Status do container:', result );

        return result;
    }
    catch ( error )
    {
        console.error( '❌ Erro ao verificar status:', error );
        return null;
    }
}

// ~~

async function getContainerLogs(
    churchId,
    lines = 20
    )
{
    console.log( `\n=== Logs do Container ${ churchId } ===\n` );

    try
    {
        let response = await fetch(
            `${ BASE_URL }/docker/container/${ churchId }/logs?lines=${ lines }`
            );

        let result = await response.json();
        
        if ( result.success )
        {
            console.log( 'Logs do container:' );
            console.log( result.logs );
        }
        else
        {
            console.error( '❌ Erro ao obter logs:', result.message );
        }

        return result;
    }
    catch ( error )
    {
        console.error( '❌ Erro ao obter logs:', error );
        return null;
    }
}

// ~~

async function stopContainer(
    churchId
    )
{
    console.log( `\n=== Parando Container ${ churchId } ===\n` );

    try
    {
        let response = await fetch(
            `${ BASE_URL }/docker/container/${ churchId }/stop`,
            {
                method: 'POST'
            }
            );

        let result = await response.json();
        console.log( 'Resultado da parada:', result );

        return result;
    }
    catch ( error )
    {
        console.error( '❌ Erro ao parar container:', error );
        return null;
    }
}

// -- STATEMENTS

async function runExample(
    )
{
    console.log( '🚀 Iniciando exemplo de sincronização WhatsApp...\n' );

    try
    {
        // 1. Sincronizar WhatsApp
        let syncResult = await syncWhatsApp();

        if ( syncResult && syncResult.success )
        {
            let churchId = syncResult.churchId;

            // 2. Verificar status do container
            await checkContainerStatus( churchId );

            // 3. Obter logs do container
            await getContainerLogs( churchId );

            // 4. Aguardar um pouco
            console.log( '\n⏳ Aguardando 10 segundos antes de parar o container...' );
            await new Promise( resolve => setTimeout( resolve, 10000 ) );

            // 5. Parar container
            await stopContainer( churchId );
        }
    }
    catch ( error )
    {
        console.error( '❌ Erro no exemplo:', error );
    }
}

// Executar exemplo se este arquivo for executado diretamente
if ( import.meta.url === `file://${ process.argv[ 1 ] }` )
{
    runExample();
}

export
{
    syncWhatsApp,
    checkContainerStatus,
    getContainerLogs,
    stopContainer
}; 