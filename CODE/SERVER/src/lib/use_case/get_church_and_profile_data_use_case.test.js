// -- IMPORTS

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GetChurchAndProfileDataUseCase } from './get_church_and_profile_data_use_case';
import { databaseService } from '../service/database_service';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { NotFoundError } from '../errors/not_found';

// -- VARIABLES

vi.mock( '../service/database_service' );

// -- TESTS

describe( 'GetChurchAndProfileDataUseCase', () => 
{
    let useCase;
    let mockClient;

    beforeEach( () =>
    {
        useCase = new GetChurchAndProfileDataUseCase();
        mockClient = {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn()
        };
        databaseService.getClient.mockReturnValue( mockClient );
        vi.clearAllMocks();
    } );

    it( 'should return church and profile data when successful', async () =>
    {
        let mockData = {
            id: 'profile-123',
            firstName: 'John',
            lastName: 'Doe',
            phonePrefix: '+55',
            phoneNumber: '11999999999',
            documentType: 'cpf',
            documentNumber: '123.456.789-00',
            genderId: 'male',
            imagePath: '/path/to/profile.jpg',
            USER_CHURCH_ROLE: [{
                churchId: 'church-123',
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
                }
            }]
        };

        mockClient.single.mockResolvedValue( { data: mockData, error: null } );

        let result = await useCase.execute( 'profile-123' );

        expect( mockClient.from ).toHaveBeenCalledWith( 'PROFILE' );
        expect( mockClient.eq ).toHaveBeenCalledWith( 'id', 'profile-123' );
        expect( result ).toEqual( {
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
        } );
    } );

    it( 'should throw UnauthenticatedError when profileId is not provided', async () =>
    {
        await expect( useCase.execute( null ) )
            .rejects
            .toThrow( UnauthenticatedError );

        expect( mockClient.from ).not.toHaveBeenCalled();
    } );

    it( 'should throw NotFoundError when profile is not found', async () =>
    {
        mockClient.single.mockResolvedValue( { 
            data: null, 
            error: { code: 'PGRST116' } 
        } );

        await expect( useCase.execute( 'profile-123' ) )
            .rejects
            .toThrow( NotFoundError );

        expect( mockClient.from ).toHaveBeenCalledWith( 'PROFILE' );
    } );

    it( 'should throw NotFoundError when church is not found', async () =>
    {
        let mockData = {
            id: 'profile-123',
            firstName: 'John',
            lastName: 'Doe',
            USER_CHURCH_ROLE: []
        };

        mockClient.single.mockResolvedValue( { data: mockData, error: null } );

        await expect( useCase.execute( 'profile-123' ) )
            .rejects
            .toThrow( NotFoundError );
    } );

    it( 'should throw Error when database query fails', async () =>
    {
        mockClient.single.mockResolvedValue( { 
            data: null, 
            error: { code: 'PGRST500', message: 'Database error' } 
        } );

        await expect( useCase.execute( 'profile-123' ) )
            .rejects
            .toThrow( 'Failed to get church and profile data' );

        expect( mockClient.from ).toHaveBeenCalledWith( 'PROFILE' );
    } );
} ); 