// -- IMPORTS

import fetch from 'node-fetch';
import { getJsonText } from 'senselogic-gist';

// -- CONSTANTS

const BASE_URL = 'http://localhost:3000';

// -- FUNCTIONS

async function startContainer(
    churchId
    )
{
    let response = await fetch(
        `${ BASE_URL }/docker/container/start`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: getJsonText(
                {
                    churchId
                }
                )
        }
        );

    let result = await response.json();
    console.log( 'Start Container Result:', result );

    return result;
}

// ~~

async function stopContainer(
    churchId
    )
{
    let response = await fetch(
        `${ BASE_URL }/docker/container/${ churchId }/stop`,
        {
            method: 'POST'
        }
        );

    let result = await response.json();
    console.log( 'Stop Container Result:', result );

    return result;
}

// ~~

async function restartContainer(
    churchId
    )
{
    let response = await fetch(
        `${ BASE_URL }/docker/container/${ churchId }/restart`,
        {
            method: 'POST'
        }
        );

    let result = await response.json();
    console.log( 'Restart Container Result:', result );

    return result;
}

// ~~

async function getContainerStatus(
    churchId
    )
{
    let response = await fetch(
        `${ BASE_URL }/docker/container/${ churchId }/status`
        );

    let result = await response.json();
    console.log( 'Container Status Result:', result );

    return result;
}

// ~~

async function getContainerLogs(
    churchId,
    lines = 50
    )
{
    let response = await fetch(
        `${ BASE_URL }/docker/container/${ churchId }/logs?lines=${ lines }`
        );

    let result = await response.json();
    console.log( 'Container Logs Result:', result );

    return result;
}

// ~~

async function listAllContainers(
    )
{
    let response = await fetch(
        `${ BASE_URL }/docker/containers/list`
        );

    let result = await response.json();
    console.log( 'List Containers Result:', result );

    return result;
}

// ~~

async function createChurchWithDocker(
    )
{
    let churchData = {
        churchInfo: {
            name: 'Igreja Exemplo',
            addressLine1: 'Rua das Flores, 123',
            addressLine2: 'Sala 101',
            zipCode: '12345-678',
            neighborhood: 'Centro',
            cityCode: 'SP',
            stateCode: 'SP',
            countryCode: 'BR'
        },
        adminInfo: {
            firstName: 'João',
            lastName: 'Silva',
            email: 'joao.silva@igreja.com',
            phonePrefix: '+55',
            phoneNumber: '11987654321',
            birthDate: '1980-01-01',
            genderId: 1,
            countryCode: 'BR',
            aboutDescription: 'Administrador da igreja'
        },
        selectedPlan: 1,
        isAnnual: false
    };

    let response = await fetch(
        `${ BASE_URL }/church/add`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( churchData )
        }
        );

    let result = await response.json();
    console.log( 'Create Church Result:', result );

    return result;
}

// -- STATEMENTS

async function runExamples(
    )
{
    console.log( '=== Exemplos de Endpoints Docker ===\n' );

    try
    {
        // 1. Criar uma igreja (inicia automaticamente o container)
        console.log( '1. Criando igreja...' );
        let churchResult = await createChurchWithDocker();
        let churchId = churchResult.churchId || 'church_example_123';

        console.log( '\n2. Verificando status do container...' );
        await getContainerStatus( churchId );

        console.log( '\n3. Obtendo logs do container...' );
        await getContainerLogs( churchId, 10 );

        console.log( '\n4. Listando todos os containers...' );
        await listAllContainers();

        console.log( '\n5. Reiniciando container...' );
        await restartContainer( churchId );

        console.log( '\n6. Parando container...' );
        await stopContainer( churchId );

        console.log( '\n7. Iniciando container novamente...' );
        await startContainer( churchId );

    }
    catch ( error )
    {
        console.error( 'Erro ao executar exemplos:', error );
    }
}

// Executar exemplos se este arquivo for executado diretamente
if ( import.meta.url === `file://${ process.argv[ 1 ] }` )
{
    runExamples();
}

export
{
    startContainer,
    stopContainer,
    restartContainer,
    getContainerStatus,
    getContainerLogs,
    listAllContainers,
    createChurchWithDocker
}; 