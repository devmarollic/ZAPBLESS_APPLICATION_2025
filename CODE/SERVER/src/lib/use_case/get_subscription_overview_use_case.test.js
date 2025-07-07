// -- IMPORTS

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSubscriptionOverviewUseCase } from './get_subscription_overview_use_case';
import { subscriptionService } from '../service/subscription_service';
import { planService } from '../service/plan_service';
import { ValidationError } from '../errors/validation_error';

// -- MOCKS

vi.mock( '../service/subscription_service' );
vi.mock( '../service/plan_service' );

// -- TESTS

describe( 'GetSubscriptionOverviewUseCase', () => {
    beforeEach( () => {
        vi.clearAllMocks();
    } );

    it( 'should return subscription overview successfully', async () => {
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
            churchId: 'church-123',
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

        let mockPlanByIdMap = {
            'plan-123': mockPlan
        };

        subscriptionService.getSubscriptionByChurchId.mockResolvedValue( mockSubscription );
        subscriptionService.getSubscriptionHistoryByChurchId.mockResolvedValue( {
            data: [ mockSubscription ],
            count: 1
        } );
        planService.getCachedPlanByIdMap.mockResolvedValue( [] );
        planService.cachedPlanByIdMap = mockPlanByIdMap;

        let input = {
            churchId: 'church-123',
            page: 1,
            limit: 10
        };

        let result = await getSubscriptionOverviewUseCase.execute( input );

        expect( result ).toHaveProperty( 'currentPlan' );
        expect( result ).toHaveProperty( 'nextBilling' );
        expect( result ).toHaveProperty( 'invoiceHistory' );
        expect( result.currentPlan.planName ).toBe( 'Plano Crescimento' );
        expect( result.currentPlan.isActive ).toBe( true );
        expect( result.nextBilling ).not.toBeNull();
        expect( result.invoiceHistory.invoices ).toHaveLength( 1 );
    } );

    it( 'should return null data when no subscription found', async () => {
        subscriptionService.getSubscriptionByChurchId.mockResolvedValue( null );
        subscriptionService.getSubscriptionHistoryByChurchId.mockResolvedValue( {
            data: [],
            count: 0
        } );

        let input = {
            churchId: 'church-123',
            page: 1,
            limit: 10
        };

        let result = await getSubscriptionOverviewUseCase.execute( input );

        expect( result.currentPlan ).toBeNull();
        expect( result.nextBilling ).toBeNull();
        expect( result.invoiceHistory.invoices ).toHaveLength( 0 );
    } );

    it( 'should return no next billing for inactive subscription', async () => {
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
            churchId: 'church-123',
            planId: 'plan-123',
            statusId: 'canceled',
            typeId: 'canceled',
            periodId: 'monthly',
            price: 49.90,
            startAtDateTimestamp: '2024-01-01T00:00:00.000Z',
            expiresAtDateTimestamp: '2024-02-01T00:00:00.000Z',
            paymentMethodId: 'credit_card',
            paymentGatewayId: 'gateway-123',
            plan: mockPlan
        };

        let mockPlanByIdMap = {
            'plan-123': mockPlan
        };

        subscriptionService.getSubscriptionByChurchId.mockResolvedValue( mockSubscription );
        subscriptionService.getSubscriptionHistoryByChurchId.mockResolvedValue( {
            data: [ mockSubscription ],
            count: 1
        } );
        planService.getCachedPlanByIdMap.mockResolvedValue( [] );
        planService.cachedPlanByIdMap = mockPlanByIdMap;

        let input = {
            churchId: 'church-123',
            page: 1,
            limit: 10
        };

        let result = await getSubscriptionOverviewUseCase.execute( input );

        expect( result.currentPlan.isActive ).toBe( false );
        expect( result.nextBilling ).toBeNull();
    } );

    it( 'should throw ValidationError for invalid input', async () => {
        let input = {
            churchId: '',
            page: 0,
            limit: 101
        };

        await expect( getSubscriptionOverviewUseCase.execute( input ) ).rejects.toThrow( ValidationError );
    } );

    it( 'should throw ValidationError when plan not found', async () => {
        let mockSubscription = {
            id: 'sub-123',
            churchId: 'church-123',
            planId: 'plan-123',
            statusId: 'paid',
            typeId: 'active',
            periodId: 'monthly'
        };

        subscriptionService.getSubscriptionByChurchId.mockResolvedValue( mockSubscription );
        subscriptionService.getSubscriptionHistoryByChurchId.mockResolvedValue( {
            data: [],
            count: 0
        } );
        planService.getCachedPlanByIdMap.mockResolvedValue( [] );
        planService.cachedPlanByIdMap = {};

        let input = {
            churchId: 'church-123',
            page: 1,
            limit: 10
        };

        await expect( getSubscriptionOverviewUseCase.execute( input ) ).rejects.toThrow( ValidationError );
    } );
} ); 