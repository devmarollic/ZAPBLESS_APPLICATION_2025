// -- IMPORTS

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetChurchAndProfileDataController } from './get_church_and_profile_data_controller';
import { getChurchAndProfileDataUseCase } from '../use_case/get_church_and_profile_data_use_case';
import { UnauthenticatedError } from '../errors/unauthenticated_error';

// -- VARIABLES

vi.mock( '../use_case/get_church_and_profile_data_use_case' );

// -- TESTS

describe( 'GetChurchAndProfileDataController', () => 
{
    let controller;
    let mockRequest;
    let mockReply;

    beforeEach( () =>
    {
        controller = new GetChurchAndProfileDataController();
        mockRequest = {};
        mockReply = {};
        vi.clearAllMocks();
    } );

    it( 'should return church and profile data when user is authenticated', async () =>
    {
        let mockProfileLogged = { id: 'profile-123' };
        let mockResult = {
            church: {
                id: 'church-123',
                name: 'Test Church',
                imagePath: '/path/to/image.jpg',
                addressLine1: 'Street 123',
                addressLine2: 'Apt 456',
                cityName: 'Test City',
                stateName: 'Test State',
                countryCode: 'BR',
                neighborhood: 'Test Neighborhood',
                zipCode: '12345-678'
            },
            user: {
                id: 'profile-123',
                firstName: 'John',
                lastName: 'Doe',
                phonePrefix: '+55',
                phoneNumber: '11999999999',
                documentType: 'cpf',
                documentNumber: '123.456.789-00',
                genderId: 'male',
                imagePath: '/path/to/profile.jpg'
            }
        };

        mockRequest.profileLogged = mockProfileLogged;
        getChurchAndProfileDataUseCase.execute.mockResolvedValue( mockResult );

        let result = await controller.handle( mockRequest, mockReply );

        expect( getChurchAndProfileDataUseCase.execute ).toHaveBeenCalledWith( 'profile-123' );
        expect( result ).toEqual( mockResult );
    } );

    it( 'should throw UnauthenticatedError when user is not authenticated', async () =>
    {
        mockRequest.profileLogged = null;

        await expect( controller.handle( mockRequest, mockReply ) )
            .rejects
            .toThrow( UnauthenticatedError );

        expect( getChurchAndProfileDataUseCase.execute ).not.toHaveBeenCalled();
    } );

    it( 'should throw error when use case fails', async () =>
    {
        let mockProfileLogged = { id: 'profile-123' };
        let mockError = new Error( 'Database error' );

        mockRequest.profileLogged = mockProfileLogged;
        getChurchAndProfileDataUseCase.execute.mockRejectedValue( mockError );

        await expect( controller.handle( mockRequest, mockReply ) )
            .rejects
            .toThrow( 'Database error' );

        expect( getChurchAndProfileDataUseCase.execute ).toHaveBeenCalledWith( 'profile-123' );
    } );
} ); 