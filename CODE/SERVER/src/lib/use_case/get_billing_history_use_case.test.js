// -- IMPORTS

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBillingHistoryUseCase } from './get_billing_history_use_case';
import { subscriptionService } from '../service/subscription_service';
import { ValidationError } from '../errors/validation_error';

// -- MOCKS

vi.mock( '../service/subscription_service' );

// -- TESTS

describe( 'GetBillingHistoryUseCase', () => {
    beforeEach( () => {
        vi.clearAllMocks();
    } );

    it( 'should return billing history successfully', async () => {
        let mockPlan = {
            id: 'plan-123',
            name: 'Plano Crescimento',
            description: 'Plano para igrejas em crescimento',
            monthlyPrice: 49.90,
            annualPrice: 499.90,
            currencyCode: 'BRL'
        };

        let mockSubscription = {
            id: 'sub-123',
            planId: 'plan-123',
            statusId: 'paid',
            typeId: 'active',
            periodId: 'monthly',
            price: 49.90,
            startAtDateTimestamp: '2024-01-01T00:00:00.000Z',
            expiresAtDateTimestamp: '2024-02-01T00:00:00.000Z',
            paymentMethodId: 'credit_card',
            paymentGatewayId: 'gateway-123',
            plan: mockPlan
        };

        subscriptionService.getSubscriptionHistoryByChurchId.mockResolvedValue( {
            data: [ mockSubscription ],
            count: 1
        } );

        let input = {
            churchId: 'church-123',
            page: 1,
            limit: 10
        };

        let result = await getBillingHistoryUseCase.execute( input );

        expect( result ).toHaveProperty( 'invoices' );
        expect( result ).toHaveProperty( 'pagination' );
        expect( result.invoices ).toHaveLength( 1 );
        expect( result.invoices[0].planName ).toBe( 'Plano Crescimento' );
        expect( result.invoices[0].amount ).toBe( 49.90 );
        expect( result.pagination.total ).toBe( 1 );
    } );

    it( 'should return empty data when no subscriptions found', async () => {
        subscriptionService.getSubscriptionHistoryByChurchId.mockResolvedValue( {
            data: [],
            count: 0
        } );

        let input = {
            churchId: 'church-123',
            page: 1,
            limit: 10
        };

        let result = await getBillingHistoryUseCase.execute( input );

        expect( result.invoices ).toHaveLength( 0 );
        expect( result.pagination.total ).toBe( 0 );
    } );

    it( 'should throw ValidationError for invalid input', async () => {
        let input = {
            churchId: '',
            page: 0,
            limit: 101
        };

        await expect( getBillingHistoryUseCase.execute( input ) ).rejects.toThrow( ValidationError );
    } );

    it( 'should handle null data from service', async () => {
        subscriptionService.getSubscriptionHistoryByChurchId.mockResolvedValue( {
            data: null,
            count: 0
        } );

        let input = {
            churchId: 'church-123',
            page: 1,
            limit: 10
        };

        let result = await getBillingHistoryUseCase.execute( input );

        expect( result.invoices ).toHaveLength( 0 );
        expect( result.pagination.total ).toBe( 0 );
    } );

    it( 'should map subscription status correctly', async () => {
        let mockPlan = {
            id: 'plan-123',
            name: 'Plano Crescimento',
            monthlyPrice: 49.90,
            annualPrice: 499.90,
            currencyCode: 'BRL'
        };

        let mockSubscription = {
            id: 'sub-123',
            planId: 'plan-123',
            statusId: 'pending',
            typeId: 'active',
            periodId: 'monthly',
            price: 49.90,
            startAtDateTimestamp: '2024-01-01T00:00:00.000Z',
            expiresAtDateTimestamp: '2024-02-01T00:00:00.000Z',
            paymentMethodId: 'credit_card',
            paymentGatewayId: 'gateway-123',
            plan: mockPlan
        };

        subscriptionService.getSubscriptionHistoryByChurchId.mockResolvedValue( {
            data: [ mockSubscription ],
            count: 1
        } );

        let input = {
            churchId: 'church-123',
            page: 1,
            limit: 10
        };

        let result = await getBillingHistoryUseCase.execute( input );

        expect( result.invoices[0].status ).toBe( 'pending' );
    } );
} ); 