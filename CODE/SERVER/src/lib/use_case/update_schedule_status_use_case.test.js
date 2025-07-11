// -- IMPORTS

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateScheduleStatusUseCase } from './update_schedule_status_use_case';
import { scheduleService } from '../service/schedule_service';
import { AppError } from '../errors/app_error';
import { scheduleStatus } from '../model/schedule';

// -- CONSTANTS

vi.mock( '../service/schedule_service' );

// -- TESTS

describe( 'UpdateScheduleStatusUseCase', () =>
    {
    beforeEach( () =>
        {
        vi.clearAllMocks();
        } );

    it( 'should update schedule status successfully', async () =>
        {
        let mockSchedule = {
            id: 'schedule123',
            churchId: 'church123',
            eventId: 'event123',
            statusId: 'pending'
        };

        let updatedSchedule = {
            ...mockSchedule,
            statusId: 'sent',
            updateTimestamp: '2025-01-30T10:00:00.000Z'
        };

        scheduleService.getScheduleById = vi.fn().mockResolvedValue( mockSchedule );
        scheduleService.setScheduleById = vi.fn().mockResolvedValue( updatedSchedule );

        let result = await updateScheduleStatusUseCase.execute(
            {
                scheduleId: 'schedule123',
                statusId: 'sent',
                churchId: 'church123'
            }
            );

        expect( scheduleService.getScheduleById ).toHaveBeenCalledWith( 'schedule123' );
        expect( scheduleService.setScheduleById ).toHaveBeenCalledWith(
            {
                statusId: 'sent',
                updateTimestamp: expect.any( String )
            },
            'schedule123'
            );
        expect( result ).toEqual( updatedSchedule );
        } );

    it( 'should update schedule status with error message', async () =>
        {
        let mockSchedule = {
            id: 'schedule123',
            churchId: 'church123',
            eventId: 'event123',
            statusId: 'pending'
        };

        let updatedSchedule = {
            ...mockSchedule,
            statusId: 'failed',
            errorMessage: 'Network error',
            updateTimestamp: '2025-01-30T10:00:00.000Z'
        };

        scheduleService.getScheduleById = vi.fn().mockResolvedValue( mockSchedule );
        scheduleService.setScheduleById = vi.fn().mockResolvedValue( updatedSchedule );

        let result = await updateScheduleStatusUseCase.execute(
            {
                scheduleId: 'schedule123',
                statusId: 'failed',
                churchId: 'church123',
                errorMessage: 'Network error'
            }
            );

        expect( scheduleService.setScheduleById ).toHaveBeenCalledWith(
            {
                statusId: 'failed',
                errorMessage: 'Network error',
                updateTimestamp: expect.any( String )
            },
            'schedule123'
            );
        expect( result ).toEqual( updatedSchedule );
        } );

    it( 'should throw error when schedule not found', async () =>
        {
        scheduleService.getScheduleById = vi.fn().mockResolvedValue( null );

        await expect( updateScheduleStatusUseCase.execute(
            {
                scheduleId: 'nonexistent',
                statusId: 'sent',
                churchId: 'church123'
            }
            ) ).rejects.toThrow( AppError );

        expect( scheduleService.getScheduleById ).toHaveBeenCalledWith( 'nonexistent' );
        } );

    it( 'should throw error when schedule belongs to different church', async () =>
        {
        let mockSchedule = {
            id: 'schedule123',
            churchId: 'church456',
            eventId: 'event123',
            statusId: 'pending'
        };

        scheduleService.getScheduleById = vi.fn().mockResolvedValue( mockSchedule );

        await expect( updateScheduleStatusUseCase.execute(
            {
                scheduleId: 'schedule123',
                statusId: 'sent',
                churchId: 'church123'
            }
            ) ).rejects.toThrow( AppError );

        expect( scheduleService.getScheduleById ).toHaveBeenCalledWith( 'schedule123' );
        } );

    it( 'should throw error when update operation fails', async () =>
        {
        let mockSchedule = {
            id: 'schedule123',
            churchId: 'church123',
            eventId: 'event123',
            statusId: 'pending'
        };

        scheduleService.getScheduleById = vi.fn().mockResolvedValue( mockSchedule );
        scheduleService.setScheduleById = vi.fn().mockResolvedValue( null );

        await expect( updateScheduleStatusUseCase.execute(
            {
                scheduleId: 'schedule123',
                statusId: 'sent',
                churchId: 'church123'
            }
            ) ).rejects.toThrow( AppError );

        expect( scheduleService.getScheduleById ).toHaveBeenCalledWith( 'schedule123' );
        expect( scheduleService.setScheduleById ).toHaveBeenCalled();
        } );

    it( 'should validate statusId enum values', async () =>
        {
        await expect( updateScheduleStatusUseCase.execute(
            {
                scheduleId: 'schedule123',
                statusId: 'invalid_status',
                churchId: 'church123'
            }
            ) ).rejects.toThrow();
        } );
    } ); 