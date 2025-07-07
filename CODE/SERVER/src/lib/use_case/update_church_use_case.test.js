// -- IMPORTS

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateChurchUseCase } from './update_church_use_case';
import { ZodError } from 'zod';
import { churchService } from '../service/church_service';

// -- MOCKS

vi.mock( '../service/church_service' );

// -- TESTS

describe( 'UpdateChurchUseCase', () => 
{
    let useCase;

    beforeEach( () =>
    {
        useCase = new UpdateChurchUseCase();
        vi.clearAllMocks();
    } );

    it( 'should update church with valid data', async () =>
    {
        let input = {
            churchData: {
                name: 'Updated Church Name',
                addressLine1: 'New Address Line 1',
                addressLine2: 'New Address Line 2',
                zipCode: '12345-678',
                neighborhood: 'New Neighborhood',
                cityCode: 'SP',
                stateCode: 'SP',
                countryCode: 'BR'
            },
            churchId: 'church-123'
        };

        let mockUpdatedChurch = {
            id: 'church-123',
            ...input.churchData
        };

        churchService.setChurchById.mockResolvedValue( mockUpdatedChurch );

        let result = await useCase.execute( input );

        expect( churchService.setChurchById ).toHaveBeenCalledWith(
            input.churchData,
            input.churchId
        );

        expect( result ).toEqual( mockUpdatedChurch );
    } );

    it( 'should update church with partial data', async () =>
    {
        let input = {
            churchData: {
                name: 'Updated Church Name'
            },
            churchId: 'church-123'
        };

        let mockUpdatedChurch = {
            id: 'church-123',
            name: 'Updated Church Name'
        };

        churchService.setChurchById.mockResolvedValue( mockUpdatedChurch );

        let result = await useCase.execute( input );

        expect( churchService.setChurchById ).toHaveBeenCalledWith(
            input.churchData,
            input.churchId
        );

        expect( result ).toEqual( mockUpdatedChurch );
    } );

    it( 'should throw ZodError with invalid data', async () =>
    {
        let input = {
            churchData: {
                countryCode: 'INVALID_CODE'
            },
            churchId: 'church-123'
        };

        await expect( useCase.execute( input ) )
            .rejects
            .toThrow( ZodError );
    } );

    it( 'should throw ZodError when no data is provided', async () =>
    {
        let input = {
            churchData: {},
            churchId: 'church-123'
        };

        await expect( useCase.execute( input ) )
            .rejects
            .toThrow( ZodError );
    } );
} ); 