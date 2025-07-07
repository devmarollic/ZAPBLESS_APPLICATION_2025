// -- IMPORTS

import { ListChurchUsersWithFiltersController } from './list_church_users_with_filters_controller';
import { listChurchUsersWithFiltersUseCase } from '../use_case/list_church_users_with_filters_use_case';
import { roleValidationService } from '../service/role_validation_service';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { AppError } from '../errors/app_error';

// -- MOCKS

jest.mock( '../use_case/list_church_users_with_filters_use_case' );
jest.mock( '../service/role_validation_service' );

// -- TESTS

describe( 'ListChurchUsersWithFiltersController', () =>
{
    let controller;
    let request;
    let reply;

    beforeEach( () =>
    {
        controller = new ListChurchUsersWithFiltersController();
        request = {
            profileLogged: {
                id: 'profile-id',
                user_metadata: {
                    church_id: 'church-id'
                }
            },
            query: {
                nameFilter: 'John',
                emailFilter: 'john@example.com',
                statusFilter: 'active',
                roleFilter: 'administrator',
                page: '1',
                limit: '10'
            }
        };
        reply = {};

        jest.clearAllMocks();
    } );

    it( 'should list church users with filters when user is authenticated and is administrator', async () =>
    {
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

        roleValidationService.validateUserIsAdministrator.mockResolvedValue( true );
        listChurchUsersWithFiltersUseCase.execute.mockResolvedValue( expectedResult );

        let result = await controller.handle( request, reply );

        expect( roleValidationService.validateUserIsAdministrator ).toHaveBeenCalledWith(
            'profile-id',
            'church-id'
        );
        expect( listChurchUsersWithFiltersUseCase.execute ).toHaveBeenCalledWith(
            {
                churchId: 'church-id',
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

    it( 'should throw UnauthenticatedError when user is not authenticated', async () =>
    {
        request.profileLogged = null;

        await expect( controller.handle( request, reply ) ).rejects.toThrow( UnauthenticatedError );
    } );

    it( 'should throw error when user is not administrator', async () =>
    {
        roleValidationService.validateUserIsAdministrator.mockRejectedValue(
            new AppError( 'INSUFFICIENT_PERMISSIONS', 403 )
        );

        await expect( controller.handle( request, reply ) ).rejects.toThrow( AppError );
        expect( roleValidationService.validateUserIsAdministrator ).toHaveBeenCalledWith(
            'profile-id',
            'church-id'
        );
    } );

    it( 'should use default pagination values when not provided', async () =>
    {
        request.query = {};

        roleValidationService.validateUserIsAdministrator.mockResolvedValue( true );
        listChurchUsersWithFiltersUseCase.execute.mockResolvedValue( {} );

        await controller.handle( request, reply );

        expect( listChurchUsersWithFiltersUseCase.execute ).toHaveBeenCalledWith(
            {
                churchId: 'church-id',
                nameFilter: undefined,
                emailFilter: undefined,
                statusFilter: undefined,
                roleFilter: undefined,
                page: 1,
                limit: 10
            }
        );
    } );

    it( 'should handle edge case when user metadata is undefined', async () =>
    {
        request.profileLogged = {
            id: 'profile-id',
            user_metadata: undefined
        };

        await expect( controller.handle( request, reply ) ).rejects.toThrow();
    } );

    it( 'should handle string to number conversion for page and limit', async () =>
    {
        request.query = {
            page: '5',
            limit: '20'
        };

        roleValidationService.validateUserIsAdministrator.mockResolvedValue( true );
        listChurchUsersWithFiltersUseCase.execute.mockResolvedValue( {} );

        await controller.handle( request, reply );

        expect( listChurchUsersWithFiltersUseCase.execute ).toHaveBeenCalledWith(
            {
                churchId: 'church-id',
                nameFilter: undefined,
                emailFilter: undefined,
                statusFilter: undefined,
                roleFilter: undefined,
                page: 5,
                limit: 20
            }
        );
    } );
} ); 