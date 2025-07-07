// -- IMPORTS

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetSubscriptionOverviewController } from './get_subscription_overview_controller';
import { getSubscriptionOverviewUseCase } from '../use_case/get_subscription_overview_use_case';
import { UnauthenticatedError } from '../errors/unauthenticated_error';

// -- MOCKS

vi.mock( '../use_case/get_subscription_overview_use_case' );

// -- TESTS

describe( 'GetSubscriptionOverviewController', () => {
    let controller;

    beforeEach( () => {
        vi.clearAllMocks();
        controller = new GetSubscriptionOverviewController();
    } );

    it( 'should handle subscription overview request successfully', async () => {
        let mockRequest = {
            profileLogged: {
                user_metadata: {
                    church_id: 'church-123'
                }
            },
            query: {
                page: '1',
                limit: '10'
            }
        };

        let mockReply = {};

        let mockResult = {
            currentPlan: {
                planName: 'Plano Crescimento',
                isActive: true
            },
            nextBilling: {
                date: '2024-02-01T00:00:00.000Z',
                amount: 49.90
            },
            invoiceHistory: {
                invoices: [],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 0,
                    pages: 0
                }
            }
        };

        getSubscriptionOverviewUseCase.execute.mockResolvedValue( mockResult );

        let result = await controller.handle( mockRequest, mockReply );

        expect( getSubscriptionOverviewUseCase.execute ).toHaveBeenCalledWith( {
            churchId: 'church-123',
            page: 1,
            limit: 10
        } );

        expect( result ).toEqual( mockResult );
    } );

    it( 'should use default pagination when not provided', async () => {
        let mockRequest = {
            profileLogged: {
                user_metadata: {
                    church_id: 'church-123'
                }
            },
            query: {}
        };

        let mockReply = {};

        let mockResult = {
            currentPlan: null,
            nextBilling: null,
            invoiceHistory: {
                invoices: [],
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 0,
                    pages: 0
                }
            }
        };

        getSubscriptionOverviewUseCase.execute.mockResolvedValue( mockResult );

        let result = await controller.handle( mockRequest, mockReply );

        expect( getSubscriptionOverviewUseCase.execute ).toHaveBeenCalledWith( {
            churchId: 'church-123',
            page: 1,
            limit: 10
        } );

        expect( result ).toEqual( mockResult );
    } );

    it( 'should throw UnauthenticatedError when profileLogged is null', async () => {
        let mockRequest = {
            profileLogged: null,
            query: {}
        };

        let mockReply = {};

        await expect( controller.handle( mockRequest, mockReply ) ).rejects.toThrow( UnauthenticatedError );
    } );

    it( 'should throw UnauthenticatedError when profileLogged is undefined', async () => {
        let mockRequest = {
            profileLogged: undefined,
            query: {}
        };

        let mockReply = {};

        await expect( controller.handle( mockRequest, mockReply ) ).rejects.toThrow( UnauthenticatedError );
    } );

    it( 'should parse pagination parameters correctly', async () => {
        let mockRequest = {
            profileLogged: {
                user_metadata: {
                    church_id: 'church-123'
                }
            },
            query: {
                page: '2',
                limit: '20'
            }
        };

        let mockReply = {};

        let mockResult = {
            currentPlan: null,
            nextBilling: null,
            invoiceHistory: {
                invoices: [],
                pagination: {
                    page: 2,
                    limit: 20,
                    total: 0,
                    pages: 0
                }
            }
        };

        getSubscriptionOverviewUseCase.execute.mockResolvedValue( mockResult );

        await controller.handle( mockRequest, mockReply );

        expect( getSubscriptionOverviewUseCase.execute ).toHaveBeenCalledWith( {
            churchId: 'church-123',
            page: 2,
            limit: 20
        } );
    } );
} ); 