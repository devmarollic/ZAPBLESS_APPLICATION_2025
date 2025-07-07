// -- IMPORTS

import { listChurchUsersWithFiltersUseCase } from './list_church_users_with_filters_use_case';
import { profileService } from '../service/profile_service';
import { ZodError } from 'zod';

// -- MOCKS

jest.mock( '../service/profile_service' );

// -- TESTS

describe( 'ListChurchUsersWithFiltersUseCase', () =>
{
    beforeEach( () =>
    {
        jest.clearAllMocks();
    } );

    it( 'should execute successfully with valid input', async () =>
    {
        let input = {
            churchId: 'church-id',
            nameFilter: 'John',
            emailFilter: 'john@example.com',
            statusFilter: 'active',
            roleFilter: 'administrator',
            page: 1,
            limit: 10
        };

        let expectedResult = {
            data: [
                {
                    id: 'user-1',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    statusId: 'active',
                    roleSlugArray: [ { roleSlug: 'administrator' } ]
                }
            ],
            totalCount: 1,
            totalPages: 1,
            currentPage: 1,
            hasNextPage: false,
            hasPreviousPage: false
        };

        profileService.getProfileArrayByChurchIdWithFilters.mockResolvedValue( expectedResult );

        let result = await listChurchUsersWithFiltersUseCase.execute( input );

        expect( profileService.getProfileArrayByChurchIdWithFilters ).toHaveBeenCalledWith(
            'church-id',
            {
                nameFilter: 'John',
                emailFilter: 'john@example.com',
                statusFilter: 'active',
                roleFilter: 'administrator',
                page: 1,
                limit: 10
            }
        );
        expect( result ).toBe( expectedResult );
    } );

    it( 'should execute successfully with minimal input', async () =>
    {
        let input = {
            churchId: 'church-id'
        };

        let expectedResult = {
            data: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
            hasNextPage: false,
            hasPreviousPage: false
        };

        profileService.getProfileArrayByChurchIdWithFilters.mockResolvedValue( expectedResult );

        let result = await listChurchUsersWithFiltersUseCase.execute( input );

        expect( profileService.getProfileArrayByChurchIdWithFilters ).toHaveBeenCalledWith(
            'church-id',
            {
                nameFilter: undefined,
                emailFilter: undefined,
                statusFilter: undefined,
                roleFilter: undefined,
                page: 1,
                limit: 10
            }
        );
        expect( result ).toBe( expectedResult );
    } );

    it( 'should use default values for page and limit when not provided', async () =>
    {
        let input = {
            churchId: 'church-id',
            nameFilter: 'John'
        };

        profileService.getProfileArrayByChurchIdWithFilters.mockResolvedValue( {} );

        await listChurchUsersWithFiltersUseCase.execute( input );

        expect( profileService.getProfileArrayByChurchIdWithFilters ).toHaveBeenCalledWith(
            'church-id',
            {
                nameFilter: 'John',
                emailFilter: undefined,
                statusFilter: undefined,
                roleFilter: undefined,
                page: 1,
                limit: 10
            }
        );
    } );

    it( 'should throw ZodError when churchId is missing', async () =>
    {
        let input = {
            nameFilter: 'John'
        };

        await expect( listChurchUsersWithFiltersUseCase.execute( input ) ).rejects.toThrow( ZodError );
    } );

    it( 'should throw ZodError when churchId is empty', async () =>
    {
        let input = {
            churchId: ''
        };

        await expect( listChurchUsersWithFiltersUseCase.execute( input ) ).rejects.toThrow( ZodError );
    } );

    it( 'should throw ZodError when page is less than 1', async () =>
    {
        let input = {
            churchId: 'church-id',
            page: 0
        };

        await expect( listChurchUsersWithFiltersUseCase.execute( input ) ).rejects.toThrow( ZodError );
    } );

    it( 'should throw ZodError when limit is less than 1', async () =>
    {
        let input = {
            churchId: 'church-id',
            limit: 0
        };

        await expect( listChurchUsersWithFiltersUseCase.execute( input ) ).rejects.toThrow( ZodError );
    } );

    it( 'should throw ZodError when limit is greater than 100', async () =>
    {
        let input = {
            churchId: 'church-id',
            limit: 101
        };

        await expect( listChurchUsersWithFiltersUseCase.execute( input ) ).rejects.toThrow( ZodError );
    } );

    it( 'should handle all filter types correctly', async () =>
    {
        let input = {
            churchId: 'church-id',
            nameFilter: 'John',
            emailFilter: 'john@example.com',
            statusFilter: 'active',
            roleFilter: 'administrator',
            page: 2,
            limit: 5
        };

        profileService.getProfileArrayByChurchIdWithFilters.mockResolvedValue( {} );

        await listChurchUsersWithFiltersUseCase.execute( input );

        expect( profileService.getProfileArrayByChurchIdWithFilters ).toHaveBeenCalledWith(
            'church-id',
            {
                nameFilter: 'John',
                emailFilter: 'john@example.com',
                statusFilter: 'active',
                roleFilter: 'administrator',
                page: 2,
                limit: 5
            }
        );
    } );
} ); 