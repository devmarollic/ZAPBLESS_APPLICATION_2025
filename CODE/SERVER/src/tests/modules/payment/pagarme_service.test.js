// -- IMPORTS

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { PagarmeService, PLAN_DATA } from '../../../modules/payment/pagarme_service.js';
import { AppError } from '../../../shared/errors/app_error.js';

// -- CONSTANTS

const MOCK_ENVIRONMENT = {
    PAGARME_SECRET_KEY: 'sk_test_mock_key'
};

const MOCK_PLAN = {
    id: 'test',
    name: 'Test Plan', 
    description: 'Test plan description',
    monthlyPrice: 100,
    annualPrice: 1000
};

const MOCK_SUBSCRIPTION_RESPONSE = {
    id: 'sub_test_123',
    status: 'active',
    plan: {
        id: 'plan_test_123',
        name: 'Test Plan mensal'
    }
};

// -- FUNCTIONS

vi.mock( '../../../config/environment.js', () => ({
    environment: MOCK_ENVIRONMENT
}));

global.fetch = vi.fn();

describe( 'PagarmeService', () => {
    
    let pagarmeService;
    
    beforeEach( () => {
        pagarmeService = new PagarmeService();
        vi.clearAllMocks();
    });
    
    describe( 'getAuthHeaders', () => {
        
        test( 'should return correct authorization headers', () => {
            const headers = pagarmeService.getAuthHeaders();
            const expectedAuth = Buffer.from( `${MOCK_ENVIRONMENT.PAGARME_SECRET_KEY}:` ).toString( 'base64' );
            
            expect( headers ).toEqual({
                'Authorization': `Basic ${expectedAuth}`,
                'Content-Type': 'application/json'
            });
        });
    });
    
    describe( 'makeRequest', () => {
        
        test( 'should make successful request', async () => {
            const mockResponse = { success: true };
            
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve( mockResponse )
            });
            
            const result = await pagarmeService.makeRequest( '/test', { method: 'GET' } );
            
            expect( result ).toEqual( mockResponse );
            expect( fetch ).toHaveBeenCalledWith(
                'https://api.pagar.me/core/v5/test',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        'Authorization': expect.stringContaining( 'Basic' )
                    }),
                    method: 'GET'
                })
            );
        });
        
        test( 'should throw AppError on API error', async () => {
            const mockErrorResponse = { message: 'API Error' };
            
            fetch.mockResolvedValueOnce({
                ok: false,
                statusText: 'Bad Request',
                json: () => Promise.resolve( mockErrorResponse )
            });
            
            await expect( pagarmeService.makeRequest( '/test' ) )
                .rejects
                .toThrow( AppError );
        });
        
        test( 'should handle network errors', async () => {
            fetch.mockRejectedValueOnce( new Error( 'Network error' ) );
            
            await expect( pagarmeService.makeRequest( '/test' ) )
                .rejects
                .toThrow( AppError );
        });
    });
    
    describe( 'createSubscriptionPlan', () => {
        
        test( 'should create monthly subscription plan', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve( MOCK_SUBSCRIPTION_RESPONSE )
            });
            
            const result = await pagarmeService.createSubscriptionPlan( MOCK_PLAN, true );
            
            expect( result ).toEqual( MOCK_SUBSCRIPTION_RESPONSE );
            expect( fetch ).toHaveBeenCalledWith(
                'https://api.pagar.me/core/v5/subscriptions',
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining( 'Test Plan mensal' )
                })
            );
        });
        
        test( 'should create annual subscription plan', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({
                    ...MOCK_SUBSCRIPTION_RESPONSE,
                    plan: { ...MOCK_SUBSCRIPTION_RESPONSE.plan, name: 'Test Plan anual' }
                })
            });
            
            const result = await pagarmeService.createSubscriptionPlan( MOCK_PLAN, false );
            
            expect( result.plan.name ).toContain( 'anual' );
            expect( fetch ).toHaveBeenCalledWith(
                'https://api.pagar.me/core/v5/subscriptions',
                expect.objectContaining({
                    method: 'POST',
                    body: expect.stringContaining( 'Test Plan anual' )
                })
            );
        });
        
        test( 'should validate plan data', async () => {
            const invalidPlan = { ...MOCK_PLAN, monthlyPrice: -10 };
            
            await expect( pagarmeService.createSubscriptionPlan( invalidPlan ) )
                .rejects
                .toThrow();
        });
    });
    
    describe( 'listAllSubscriptions', () => {
        
        test( 'should list subscriptions with default pagination', async () => {
            const mockListResponse = {
                data: [MOCK_SUBSCRIPTION_RESPONSE],
                paging: { total: 1, current_page: 1 }
            };
            
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve( mockListResponse )
            });
            
            const result = await pagarmeService.listAllSubscriptions();
            
            expect( result ).toEqual( mockListResponse );
            expect( fetch ).toHaveBeenCalledWith(
                'https://api.pagar.me/core/v5/subscriptions?page=1&size=25',
                expect.objectContaining({ method: 'GET' })
            );
        });
        
        test( 'should list subscriptions with custom pagination', async () => {
            const mockListResponse = { data: [], paging: { total: 0 } };
            
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve( mockListResponse )
            });
            
            await pagarmeService.listAllSubscriptions( 2, 10 );
            
            expect( fetch ).toHaveBeenCalledWith(
                'https://api.pagar.me/core/v5/subscriptions?page=2&size=10',
                expect.objectContaining({ method: 'GET' })
            );
        });
    });
    
    describe( 'getSubscriptionById', () => {
        
        test( 'should get subscription by valid ID', async () => {
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve( MOCK_SUBSCRIPTION_RESPONSE )
            });
            
            const result = await pagarmeService.getSubscriptionById( 'sub_123' );
            
            expect( result ).toEqual( MOCK_SUBSCRIPTION_RESPONSE );
        });
        
        test( 'should throw error for invalid subscription ID', async () => {
            await expect( pagarmeService.getSubscriptionById( null ) )
                .rejects
                .toThrow( AppError );
        });
    });
    
    describe( 'cancelSubscription', () => {
        
        test( 'should cancel subscription successfully', async () => {
            const mockCancelResponse = { ...MOCK_SUBSCRIPTION_RESPONSE, status: 'canceled' };
            
            fetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve( mockCancelResponse )
            });
            
            const result = await pagarmeService.cancelSubscription( 'sub_123' );
            
            expect( result.status ).toBe( 'canceled' );
        });
        
        test( 'should throw error for invalid subscription ID', async () => {
            await expect( pagarmeService.cancelSubscription( '' ) )
                .rejects
                .toThrow( AppError );
        });
    });
    
    describe( 'PLAN_DATA validation', () => {
        
        test( 'should have valid plan structure', () => {
            expect( PLAN_DATA ).toHaveLength( 3 );
            
            PLAN_DATA.forEach( plan => {
                expect( plan ).toHaveProperty( 'id' );
                expect( plan ).toHaveProperty( 'name' );
                expect( plan ).toHaveProperty( 'description' );
                expect( plan ).toHaveProperty( 'monthlyPrice' );
                expect( plan ).toHaveProperty( 'annualPrice' );
                expect( typeof plan.monthlyPrice ).toBe( 'number' );
                expect( typeof plan.annualPrice ).toBe( 'number' );
                expect( plan.monthlyPrice ).toBeGreaterThan( 0 );
                expect( plan.annualPrice ).toBeGreaterThan( 0 );
            });
        });
    });
}); 