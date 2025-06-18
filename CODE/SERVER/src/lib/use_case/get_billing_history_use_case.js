// -- IMPORTS

import { subscriptionService } from '../service/subscription_service';
import { planService } from '../service/plan_service';
import { ValidationError } from '../errors/validation_error';
import { applyPagination } from '../../base';
// -- TYPES

class GetBillingHistoryUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        this.validateInput( input );

        let subscription = await subscriptionService.getSubscriptionByChurchId( input.churchId );
        
        if ( !subscription )
        {
            return (
                {
                    invoiceArray: [],
                    pagination:
                        {
                            page: input.page,
                            limit: input.limit,
                            total: 0,
                            pages: 0
                        }
                }
                );
        }

        await planService.getCachedPlanArray();
        let plan = planService.cachedPlanByIdMap[ subscription.planId ];
        
        if ( !plan )
        {
            throw new ValidationError( 'Plan not found' );
        }

        let invoiceArray = this.buildDetailedInvoiceHistory( subscription, plan );
        
        let paginatedInvoices = applyPagination( invoiceArray, input.page, input.limit );

        return (
            {
                invoices: paginatedInvoices.data,
                pagination:
                    {
                        page: input.page,
                        limit: input.limit,
                        total: invoiceArray.length,
                        pages: Math.ceil( invoiceArray.length / input.limit )
                    }
            }
            );
    }

    // -- INQUIRIES

    validateInput(
        input
        )
    {
        let errorArray = [];

        if ( !input.churchId || input.churchId.trim() === '' )
        {
            errorArray.push( 'churchId is required' );
        }

        if ( input.page < 1 )
        {
            errorArray.push( 'page must be greater than 0' );
        }

        if ( input.limit < 1 || input.limit > 100 )
        {
            errorArray.push( 'limit must be between 1 and 100' );
        }

        if ( errorArray.length > 0 )
        {
            throw new ValidationError( errorArray.join( ', ' ) );
        }
    }

    buildDetailedInvoiceHistory(
        subscription,
        plan
        )
    {
        let invoiceArray = [];

        let baseInvoice =
            {
                id: subscription.paymentGatewayId || subscription.id,
                subscriptionId: subscription.id,
                date: subscription.startAtDateTimestamp,
                dueDate: subscription.expiresAtDateTimestamp,
                planName: plan.name,
                planId: plan.id,
                status: this.mapSubscriptionStatusToInvoiceStatus( subscription.statusId ),
                amount: subscription.price || (subscription.periodId === 'monthly' ? plan.monthlyPrice : plan.annualPrice),
                currency: plan.currencyCode || 'BRL',
                period: subscription.periodId,
                periodLabel: subscription.periodId === 'monthly' ? 'Mensal' : 'Anual',
                paymentMethod: this.getPaymentMethodLabel( subscription.paymentMethodId ),
                paymentGatewayId: subscription.paymentGatewayId,
                description: `Plano ${plan.name} - ${subscription.periodId === 'monthly' ? 'Mensal' : 'Anual'}`,
                chargeDetails: subscription.chargeInfo || null
            };

        invoiceArray.push( baseInvoice );

        if ( subscription.typeId === 'active' && subscription.statusId === 'paid' )
        {
            let nextInvoice =
                {
                    ...baseInvoice,
                    id: `next-${subscription.id}`,
                    date: subscription.expiresAtDateTimestamp,
                    dueDate: this.calculateNextDueDate( subscription.expiresAtDateTimestamp, subscription.periodId ),
                    status: 'pending',
                    description: `Próxima cobrança - Plano ${ plan.name } - ${ subscription.periodId === 'monthly' ? 'Mensal' : 'Anual' }`,
                    isNextBilling: true
                };

            invoiceArray.push( nextInvoice );
        }

        return invoiceArray.sort( ( a, b ) => new Date( b.date ) - new Date( a.date ) );
    }

    mapSubscriptionStatusToInvoiceStatus(
        subscriptionStatus
        )
    {
        let statusMap =
            {
                'paid': 'paid',
                'pending': 'pending',
                'canceled': 'cancelled',
                'refused': 'failed'
            };

        return statusMap[ subscriptionStatus ] || 'unknown';
    }

    getPaymentMethodLabel(
        paymentMethodId
        )
    {
        let methodMap =
            {
                'credit_card': 'Cartão de Crédito',
                'debit_card': 'Cartão de Débito',
                'boleto': 'Boleto Bancário',
                'pix': 'PIX'
            };

        return methodMap[ paymentMethodId ] || paymentMethodId || 'Não informado';
    }

    calculateNextDueDate(
        currentDate,
        period
        )
    {
        let date = new Date( currentDate );
        
        if ( period === 'monthly' )
        {
            date.setMonth( date.getMonth() + 1 );
        }
        else if ( period === 'annual' )
        {
            date.setFullYear( date.getFullYear() + 1 );
        }

        return date.toISOString();
    }
}

// -- VARIABLES

export const getBillingHistoryUseCase
    = new GetBillingHistoryUseCase(); 