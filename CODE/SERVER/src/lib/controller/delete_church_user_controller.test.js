// -- IMPORTS

import { DeleteChurchUserController } from './delete_church_user_controller';
import { deleteChurchUserUseCase } from '../use_case/delete_church_user_use_case';
import { roleValidationService } from '../service/role_validation_service';
import { UnauthenticatedError } from '../errors/unauthenticated_error';
import { AppError } from '../errors/app_error';

// -- MOCKS

jest.mock( '../use_case/delete_church_user_use_case' );
jest.mock( '../service/role_validation_service' );

// -- TESTS

describe( 'DeleteChurchUserController', () =>
{
    let controller;
    let request;
    let reply;

    beforeEach( () =>
    {
        controller = new DeleteChurchUserController();
        request = {
            profileLogged: {
                id: 'admin-profile-id',
                user_metadata: {
                    church_id: 'church-id'
                }
            },
            params: {
                userId: 'user-to-delete-id'
            }
        };
        reply = {};
        jest.clearAllMocks();
    } );

    it( 'should delete user when authenticated and is administrator of the same church', async () =>
    {
        let expectedResult = { success: true };
        roleValidationService.validateUserIsAdministrator.mockResolvedValue( true );
        deleteChurchUserUseCase.execute.mockResolvedValue( expectedResult );

        let result = await controller.handle( request, reply );

        expect( roleValidationService.validateUserIsAdministrator ).toHaveBeenCalledWith(
            'admin-profile-id',
            'church-id'
        );
        expect( deleteChurchUserUseCase.execute ).toHaveBeenCalledWith(
            {
                userId: 'user-to-delete-id',
                churchId: 'church-id'
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
            'admin-profile-id',
            'church-id'
        );
    } );

    it( 'should throw error when trying to delete user from another church', async () =>
    {
        roleValidationService.validateUserIsAdministrator.mockResolvedValue( true );
        deleteChurchUserUseCase.execute.mockRejectedValue(
            new AppError( 'USER_NOT_IN_CHURCH', 403 )
        );
        await expect( controller.handle( request, reply ) ).rejects.toThrow( AppError );
        expect( deleteChurchUserUseCase.execute ).toHaveBeenCalledWith(
            {
                userId: 'user-to-delete-id',
                churchId: 'church-id'
            }
        );
    } );
} ); 