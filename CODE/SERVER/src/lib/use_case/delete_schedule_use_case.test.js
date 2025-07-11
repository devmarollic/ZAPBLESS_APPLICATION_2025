// -- IMPORTS

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteScheduleUseCase } from './delete_schedule_use_case';
import { scheduleService } from '../service/schedule_service';
import { AppError } from '../errors/app_error';

// -- CONSTANTS

vi.mock( '../service/schedule_service' );

// -- TESTS

describe( 'DeleteScheduleUseCase', () =>
    {
    beforeEach( () =>
        {
        vi.clearAllMocks();
        } );

    it( 'should delete schedule successfully', async () =>
        {
        let mockSchedule = {
            id: 'schedule123',
            churchId: 'church123',
            eventId: 'event123',
            statusId: 'pending'
        };

        scheduleService.getScheduleById = vi.fn().mockResolvedValue( mockSchedule );
        scheduleService.deleteScheduleById = vi.fn().mockResolvedValue( true );

        let result = await deleteScheduleUseCase.execute(
            {
                scheduleId: 'schedule123',
                churchId: 'church123'
            }
            );

        expect( scheduleService.getScheduleById ).toHaveBeenCalledWith( 'schedule123' );
        expect( scheduleService.deleteScheduleById ).toHaveBeenCalledWith( 'schedule123' );
        expect( result ).toEqual(
            {
                message: 'Schedule deleted successfully'
            }
            );
        } );

    it( 'should throw error when schedule not found', async () =>
        {
        scheduleService.getScheduleById = vi.fn().mockResolvedValue( null );

        await expect( deleteScheduleUseCase.execute(
            {
                scheduleId: 'nonexistent',
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

        await expect( deleteScheduleUseCase.execute(
            {
                scheduleId: 'schedule123',
                churchId: 'church123'
            }
            ) ).rejects.toThrow( AppError );

        expect( scheduleService.getScheduleById ).toHaveBeenCalledWith( 'schedule123' );
        } );

    it( 'should throw error when delete operation fails', async () =>
        {
        let mockSchedule = {
            id: 'schedule123',
            churchId: 'church123',
            eventId: 'event123',
            statusId: 'pending'
        };

        scheduleService.getScheduleById = vi.fn().mockResolvedValue( mockSchedule );
        scheduleService.deleteScheduleById = vi.fn().mockResolvedValue( false );

        await expect( deleteScheduleUseCase.execute(
            {
                scheduleId: 'schedule123',
                churchId: 'church123'
            }
            ) ).rejects.toThrow( AppError );

        expect( scheduleService.getScheduleById ).toHaveBeenCalledWith( 'schedule123' );
        expect( scheduleService.deleteScheduleById ).toHaveBeenCalledWith( 'schedule123' );
        } );
    } ); 