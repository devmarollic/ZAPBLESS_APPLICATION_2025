// -- IMPORTS

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateProfileUseCase } from './update_profile_use_case';
import { ZodError } from 'zod';
import { profileService } from '../service/profile_service';

// -- MOCKS

vi.mock( '../service/profile_service' );

// -- TESTS

describe( 'UpdateProfileUseCase', () => 
{
    let useCase;

    beforeEach( () =>
    {
        useCase = new UpdateProfileUseCase();
        vi.clearAllMocks();
    } );

    it( 'should update profile with valid data', async () =>
    {
        let input = {
            profileData: {
                firstName: 'John',
                lastName: 'Doe',
                phoneNumber: '11999999999',
                aboutDescription: 'Updated description'
            },
            profileId: 'profile-123'
        };

        let mockCurrentProfile = {
            id: 'profile-123',
            firstName: 'OldName',
            lastName: 'OldLastName'
        };

        let mockUpdatedProfile = {
            id: 'profile-123',
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '11999999999',
            aboutDescription: 'Updated description',
            legalName: 'John Doe'
        };

        profileService.getProfileById.mockResolvedValue( mockCurrentProfile );
        profileService.setProfileById.mockResolvedValue( mockUpdatedProfile );

        let result = await useCase.execute( input );

        expect( profileService.getProfileById ).toHaveBeenCalledWith( 'profile-123' );
        expect( profileService.setProfileById ).toHaveBeenCalledWith(
            {
                firstName: 'John',
                lastName: 'Doe',
                phoneNumber: '11999999999',
                aboutDescription: 'Updated description',
                legalName: 'John Doe'
            },
            'profile-123'
        );

        expect( result ).toEqual( mockUpdatedProfile );
    } );

    it( 'should update profile with only firstName and preserve lastName', async () =>
    {
        let input = {
            profileData: {
                firstName: 'Jane'
            },
            profileId: 'profile-456'
        };

        let mockCurrentProfile = {
            id: 'profile-456',
            firstName: 'John',
            lastName: 'Doe'
        };

        let mockUpdatedProfile = {
            id: 'profile-456',
            firstName: 'Jane',
            lastName: 'Doe',
            legalName: 'Jane Doe'
        };

        profileService.getProfileById.mockResolvedValue( mockCurrentProfile );
        profileService.setProfileById.mockResolvedValue( mockUpdatedProfile );

        let result = await useCase.execute( input );

        expect( profileService.setProfileById ).toHaveBeenCalledWith(
            {
                firstName: 'Jane',
                legalName: 'Jane Doe'
            },
            'profile-456'
        );

        expect( result ).toEqual( mockUpdatedProfile );
    } );

    it( 'should update profile without name changes', async () =>
    {
        let input = {
            profileData: {
                phoneNumber: '11888888888',
                aboutDescription: 'New description'
            },
            profileId: 'profile-789'
        };

        let mockCurrentProfile = {
            id: 'profile-789',
            firstName: 'John',
            lastName: 'Doe'
        };

        let mockUpdatedProfile = {
            id: 'profile-789',
            phoneNumber: '11888888888',
            aboutDescription: 'New description'
        };

        profileService.getProfileById.mockResolvedValue( mockCurrentProfile );
        profileService.setProfileById.mockResolvedValue( mockUpdatedProfile );

        let result = await useCase.execute( input );

        expect( profileService.setProfileById ).toHaveBeenCalledWith(
            {
                phoneNumber: '11888888888',
                aboutDescription: 'New description'
            },
            'profile-789'
        );

        expect( result ).toEqual( mockUpdatedProfile );
    } );

    it( 'should throw error when profile not found', async () =>
    {
        let input = {
            profileData: {
                firstName: 'John'
            },
            profileId: 'profile-999'
        };

        profileService.getProfileById.mockResolvedValue( null );

        await expect( useCase.execute( input ) )
            .rejects
            .toThrow( 'PROFILE_NOT_FOUND' );
    } );

    it( 'should throw ZodError with invalid data', async () =>
    {
        let input = {
            profileData: {
                genderId: 'invalid_gender'
            },
            profileId: 'profile-123'
        };

        await expect( useCase.execute( input ) )
            .rejects
            .toThrow( ZodError );
    } );

    it( 'should throw ZodError when no data is provided', async () =>
    {
        let input = {
            profileData: {},
            profileId: 'profile-123'
        };

        await expect( useCase.execute( input ) )
            .rejects
            .toThrow( ZodError );
    } );
} ); 