// -- IMPORTS

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateProfileController } from './update_profile_controller';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { updateProfileUseCase } from '../use_case/update_profile_use_case';

// -- MOCKS

vi.mock( '../use_case/update_profile_use_case' );

// -- TESTS

describe( 'UpdateProfileController', () => 
{
    let controller;
    let mockRequest;
    let mockReply;

    beforeEach( () =>
    {
        controller = new UpdateProfileController();
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

    it( 'should update profile when user is authenticated', async () =>
    {
        let mockProfileLogged = {
            id: 'profile-123'
        };

        let mockProfileData = {
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '11999999999'
        };

        let mockUpdatedProfile = {
            id: 'profile-123',
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '11999999999',
            legalName: 'John Doe'
        };

        mockRequest.profileLogged = mockProfileLogged;
        mockRequest.body = mockProfileData;

        updateProfileUseCase.execute.mockResolvedValue( mockUpdatedProfile );

        let result = await controller.handle( mockRequest, mockReply );

        expect( updateProfileUseCase.execute ).toHaveBeenCalledWith(
            {
                profileData: mockProfileData,
                profileId: 'profile-123'
            }
        );

        expect( result ).toEqual( mockUpdatedProfile );
    } );

    it( 'should update profile with partial data', async () =>
    {
        let mockProfileLogged = {
            id: 'profile-456'
        };

        let mockProfileData = {
            aboutDescription: 'Updated description'
        };

        let mockUpdatedProfile = {
            id: 'profile-456',
            aboutDescription: 'Updated description'
        };

        mockRequest.profileLogged = mockProfileLogged;
        mockRequest.body = mockProfileData;

        updateProfileUseCase.execute.mockResolvedValue( mockUpdatedProfile );

        let result = await controller.handle( mockRequest, mockReply );

        expect( updateProfileUseCase.execute ).toHaveBeenCalledWith(
            {
                profileData: mockProfileData,
                profileId: 'profile-456'
            }
        );

        expect( result ).toEqual( mockUpdatedProfile );
    } );
} ); 