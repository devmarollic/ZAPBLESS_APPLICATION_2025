// -- IMPORTS

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateScheduleStatusController } from './update_schedule_status_controller';
import { updateScheduleStatusUseCase } from '../use_case/update_schedule_status_use_case';
import { UnauthenticatedError } from '../errors/unauthenticated_error';

// -- CONSTANTS

vi.mock( '../use_case/update_schedule_status_use_case' );

// -- TESTS

describe( 'UpdateScheduleStatusController', () =>
    {
    let controller;
    let mockRequest;
    let mockResponse;

    beforeEach( () =>
        {
        controller = new UpdateScheduleStatusController();
        mockRequest = {
            profileLogged: {
                user_metadata: {
                    church_id: 'church123'
                }
            },
            params: {
                scheduleId: 'schedule123'
            },
            body: {
                statusId: 'sent'
            }
        };
        mockResponse = {};
        vi.clearAllMocks();
        } );

    it( 'should update schedule status successfully', async () =>
        {
        let expectedResult = {
            id: 'schedule123',
            statusId: 'sent',
            updateTimestamp: '2025-01-30T10:00:00.000Z'
        };

        updateScheduleStatusUseCase.execute = vi.fn().mockResolvedValue( expectedResult );

        let result = await controller.handle( mockRequest, mockResponse );

        expect( updateScheduleStatusUseCase.execute ).toHaveBeenCalledWith(
            {
                scheduleId: 'schedule123',
                statusId: 'sent',
                churchId: 'church123',
                errorMessage: undefined
            }
            );
        expect( result ).toEqual( expectedResult );
        } );

    it( 'should update schedule status with error message', async () =>
        {
        mockRequest.body = {
            statusId: 'failed',
            errorMessage: 'Network error'
        };

        let expectedResult = {
            id: 'schedule123',
            statusId: 'failed',
            errorMessage: 'Network error',
            updateTimestamp: '2025-01-30T10:00:00.000Z'
        };

        updateScheduleStatusUseCase.execute = vi.fn().mockResolvedValue( expectedResult );

        let result = await controller.handle( mockRequest, mockResponse );

        expect( updateScheduleStatusUseCase.execute ).toHaveBeenCalledWith(
            {
                scheduleId: 'schedule123',
                statusId: 'failed',
                churchId: 'church123',
                errorMessage: 'Network error'
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