// -- IMPORTS

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateChurchController } from './update_church_controller';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { updateChurchUseCase } from '../use_case/update_church_use_case';
import { roleValidationService } from '../service/role_validation_service';

// -- MOCKS

vi.mock( '../use_case/update_church_use_case' );
vi.mock( '../service/role_validation_service' );

// -- TESTS

describe( 'UpdateChurchController', () => 
{
    let controller;
    let mockRequest;
    let mockReply;

    beforeEach( () =>
    {
        controller = new UpdateChurchController();
        mockRequest = {};
        mockReply = {};
        vi.clearAllMocks();
    } );

    it( 'should throw UnauthenticatedError when user is not authenticated', async () =>
    {
        mockRequest.profileLogged = null;

        await expect( controller.handle( mockRequest, mockReply ) )
            .rejects
            .toThrow( UnauthenticatedError );
    } );

    it( 'should update church when user is authenticated and is administrator', async () =>
    {
        let mockProfileLogged = {
            id: 'profile-123',
            user_metadata: {
                church_id: 'church-123'
            }
        };

        let mockChurchData = {
            name: 'Updated Church Name',
            addressLine1: 'New Address'
        };

        let mockUpdatedChurch = {
            id: 'church-123',
            name: 'Updated Church Name',
            addressLine1: 'New Address'
        };

        mockRequest.profileLogged = mockProfileLogged;
        mockRequest.body = mockChurchData;

        roleValidationService.validateUserIsAdministrator.mockResolvedValue( true );
        updateChurchUseCase.execute.mockResolvedValue( mockUpdatedChurch );

        let result = await controller.handle( mockRequest, mockReply );

        expect( roleValidationService.validateUserIsAdministrator ).toHaveBeenCalledWith(
            'profile-123',
            'church-123'
        );

        expect( updateChurchUseCase.execute ).toHaveBeenCalledWith(
            {
                churchData: mockChurchData,
                churchId: 'church-123'
            }
        );

        expect( result ).toEqual( mockUpdatedChurch );
    } );

    it( 'should throw error when user is not administrator', async () =>
    {
        let mockProfileLogged = {
            id: 'profile-123',
            user_metadata: {
                church_id: 'church-123'
            }
        };

        mockRequest.profileLogged = mockProfileLogged;
        mockRequest.body = { name: 'Test' };

        roleValidationService.validateUserIsAdministrator.mockRejectedValue( 
            new Error( 'INSUFFICIENT_PERMISSIONS' )
        );

        await expect( controller.handle( mockRequest, mockReply ) )
            .rejects
            .toThrow( 'INSUFFICIENT_PERMISSIONS' );
    } );
} ); 