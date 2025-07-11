// -- IMPORTS

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DeleteScheduleController } from './delete_schedule_controller';
import { deleteScheduleUseCase } from '../use_case/delete_schedule_use_case';
import { UnauthenticatedError } from '../errors/unauthenticated_error';

// -- CONSTANTS

vi.mock( '../use_case/delete_schedule_use_case' );

// -- TESTS

describe( 'DeleteScheduleController', () =>
    {
    let controller;
    let mockRequest;
    let mockResponse;

    beforeEach( () =>
        {
        controller = new DeleteScheduleController();
        mockRequest = {
            profileLogged: {
                user_metadata: {
                    church_id: 'church123'
                }
            },
            params: {
                scheduleId: 'schedule123'
            }
        };
        mockResponse = {};
        vi.clearAllMocks();
        } );

    it( 'should delete schedule successfully', async () =>
        {
        let expectedResult = {
            message: 'Schedule deleted successfully'
        };

        deleteScheduleUseCase.execute = vi.fn().mockResolvedValue( expectedResult );

        let result = await controller.handle( mockRequest, mockResponse );

        expect( deleteScheduleUseCase.execute ).toHaveBeenCalledWith(
            {
                scheduleId: 'schedule123',
                churchId: 'church123'
            }
            );
        expect( result ).toEqual( expectedResult );
        } );

    it( 'should throw UnauthenticatedError when profileLogged is null', async () =>
        {
        mockRequest.profileLogged = null;

        await expect( controller.handle( mockRequest, mockResponse ) ).rejects.toThrow( UnauthenticatedError );
        } );

    it( 'should throw UnauthenticatedError when profileLogged is undefined', async () =>
        {
        mockRequest.profileLogged = undefined;

        await expect( controller.handle( mockRequest, mockResponse ) ).rejects.toThrow( UnauthenticatedError );
        } );

    it( 'should throw UnauthenticatedError when user_metadata is missing', async () =>
        {
        mockRequest.profileLogged = {};

        await expect( controller.handle( mockRequest, mockResponse ) ).rejects.toThrow( UnauthenticatedError );
        } );

    it( 'should throw UnauthenticatedError when church_id is missing', async () =>
        {
        mockRequest.profileLogged = {
            user_metadata: {}
        };

        await expect( controller.handle( mockRequest, mockResponse ) ).rejects.toThrow( UnauthenticatedError );
        } );
    } ); 