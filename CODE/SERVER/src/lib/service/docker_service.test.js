// -- IMPORTS

import { jest } from '@jest/globals';
import { exec } from 'child_process';
import { dockerService } from './docker_service';

// -- CONSTANTS

jest.mock( 'child_process' );

// -- TESTS

describe( 'DockerService', () =>
{
    beforeEach( () =>
    {
        jest.clearAllMocks();
    } );

    describe( 'isContainerRunning', () =>
    {
        it( 'should return true when container is running', async () =>
        {
            exec.mockImplementation( ( command, callback ) =>
            {
                callback( null, 'zapbless-whatsapp-church_123', '' );
            } );

            let result = await dockerService.isContainerRunning( 'zapbless-whatsapp-church_123' );

            expect( result ).toBe( true );
            expect( exec ).toHaveBeenCalledWith(
                'docker ps --filter "name=zapbless-whatsapp-church_123" --format "{{.Names}}"',
                expect.any( Function )
            );
        } );

        it( 'should return false when container is not running', async () =>
        {
            exec.mockImplementation( ( command, callback ) =>
            {
                callback( null, '', '' );
            } );

            let result = await dockerService.isContainerRunning( 'zapbless-whatsapp-church_123' );

            expect( result ).toBe( false );
        } );

        it( 'should return false when docker command fails', async () =>
        {
            exec.mockImplementation( ( command, callback ) =>
            {
                callback( new Error( 'Docker not found' ), '', 'Docker not found' );
            } );

            let result = await dockerService.isContainerRunning( 'zapbless-whatsapp-church_123' );

            expect( result ).toBe( false );
        } );
    } );

    describe( 'getContainerStatus', () =>
    {
        it( 'should return container status', async () =>
        {
            exec.mockImplementation( ( command, callback ) =>
            {
                callback( null, 'Up 2 hours', '' );
            } );

            let result = await dockerService.getContainerStatus( 'zapbless-whatsapp-church_123' );

            expect( result ).toBe( 'Up 2 hours' );
            expect( exec ).toHaveBeenCalledWith(
                'docker ps -a --filter "name=zapbless-whatsapp-church_123" --format "{{.Status}}"',
                expect.any( Function )
            );
        } );

        it( 'should return UNKNOWN when docker command fails', async () =>
        {
            exec.mockImplementation( ( command, callback ) =>
            {
                callback( new Error( 'Docker not found' ), '', 'Docker not found' );
            } );

            let result = await dockerService.getContainerStatus( 'zapbless-whatsapp-church_123' );

            expect( result ).toBe( 'UNKNOWN' );
        } );
    } );

    describe( 'startWhatsAppContainer', () =>
    {
        it( 'should start container successfully', async () =>
        {
            // Mock container not running
            exec.mockImplementationOnce( ( command, callback ) =>
            {
                callback( null, '', '' );
            } );

            // Mock stop container
            exec.mockImplementationOnce( ( command, callback ) =>
            {
                callback( null, '', '' );
            } );

            // Mock start container
            exec.mockImplementationOnce( ( command, callback ) =>
            {
                callback( null, 'abc123def456', '' );
            } );

            let result = await dockerService.startWhatsAppContainer( 'church_123' );

            expect( result.success ).toBe( true );
            expect( result.message ).toBe( 'Container iniciado com sucesso' );
            expect( result.containerName ).toBe( 'zapbless-whatsapp-church_123' );
            expect( result.containerId ).toBe( 'abc123def456' );
        } );

        it( 'should return success when container is already running', async () =>
        {
            // Mock container already running
            exec.mockImplementationOnce( ( command, callback ) =>
            {
                callback( null, 'zapbless-whatsapp-church_123', '' );
            } );

            let result = await dockerService.startWhatsAppContainer( 'church_123' );

            expect( result.success ).toBe( true );
            expect( result.message ).toBe( 'Container já está em execução' );
        } );

        it( 'should handle docker command errors', async () =>
        {
            // Mock container not running
            exec.mockImplementationOnce( ( command, callback ) =>
            {
                callback( null, '', '' );
            } );

            // Mock stop container
            exec.mockImplementationOnce( ( command, callback ) =>
            {
                callback( null, '', '' );
            } );

            // Mock start container with error
            exec.mockImplementationOnce( ( command, callback ) =>
            {
                callback( new Error( 'Image not found' ), '', 'Image not found' );
            } );

            let result = await dockerService.startWhatsAppContainer( 'church_123' );

            expect( result.success ).toBe( false );
            expect( result.message ).toBe( 'Erro ao iniciar container' );
            expect( result.error ).toBe( 'Image not found' );
        } );
    } );

    describe( 'stopWhatsAppContainer', () =>
    {
        it( 'should stop and remove container successfully', async () =>
        {
            // Mock stop container
            exec.mockImplementationOnce( ( command, callback ) =>
            {
                callback( null, '', '' );
            } );

            // Mock remove container
            exec.mockImplementationOnce( ( command, callback ) =>
            {
                callback( null, '', '' );
            } );

            let result = await dockerService.stopWhatsAppContainer( 'church_123' );

            expect( result.success ).toBe( true );
            expect( result.message ).toBe( 'Container parado e removido com sucesso' );
        } );

        it( 'should handle container not existing', async () =>
        {
            // Mock stop container with "No such container" error
            exec.mockImplementationOnce( ( command, callback ) =>
            {
                callback( new Error( 'No such container' ), '', 'No such container' );
            } );

            let result = await dockerService.stopWhatsAppContainer( 'church_123' );

            expect( result.success ).toBe( true );
            expect( result.message ).toBe( 'Container não estava em execução' );
        } );
    } );

    describe( 'getPortForChurch', () =>
    {
        it( 'should generate consistent port for same churchId', () =>
        {
            let port1 = dockerService.getPortForChurch( 'church_123' );
            let port2 = dockerService.getPortForChurch( 'church_123' );

            expect( port1 ).toBe( port2 );
        } );

        it( 'should generate different ports for different churchIds', () =>
        {
            let port1 = dockerService.getPortForChurch( 'church_123' );
            let port2 = dockerService.getPortForChurch( 'church_456' );

            expect( port1 ).not.toBe( port2 );
        } );

        it( 'should generate ports between 3001 and 4000', () =>
        {
            let port = dockerService.getPortForChurch( 'church_123' );

            expect( port ).toBeGreaterThanOrEqual( 3001 );
            expect( port ).toBeLessThanOrEqual( 4000 );
        } );
    } );

    describe( 'getActiveContainers', () =>
    {
        it( 'should return empty array when no containers are active', () =>
        {
            let result = dockerService.getActiveContainers();

            expect( result ).toEqual( [] );
        } );

        it( 'should return active containers', () =>
        {
            // Add a container to the active containers map
            dockerService.activeContainers.set( 'church_123', 'zapbless-whatsapp-church_123' );

            let result = dockerService.getActiveContainers();

            expect( result ).toEqual( [ [ 'church_123', 'zapbless-whatsapp-church_123' ] ] );

            // Clean up
            dockerService.activeContainers.clear();
        } );
    } );
} ); 