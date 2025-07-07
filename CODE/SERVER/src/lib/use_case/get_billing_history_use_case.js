// -- IMPORTS

import { subscriptionService } from '../service/subscription_service';
import { ValidationError } from '../errors/validation_error';
import { getCeilInteger } from 'senselogic-gist';
// -- TYPES

class GetBillingHistoryUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        this.validateInput( input );

        let historyData = await subscriptionService.getSubscriptionHistoryByChurchId( input.churchId, input.page, input.limit );
        
        if ( !historyData.data || historyData.data.length === 0 )
        {
            return (
                {
                    invoiceArray: [],
                    pagination:
                        {
                            page: input.page,
                            limit: input.limit,
                            total: 0,
                            pageCount: 0
                        }
                }
                );
        }

        let invoiceArray = historyData.data.map( subscription => {
            return (
                {
                    id: subscription.paymentGatewayId || subscription.id,
                    subscriptionId: subscription.id,
                    date: subscription.startAtDateTimestamp,
                    dueDate: subscription.expiresAtDateTimestamp,
                    planName: subscription.plan.name,
                    planId: subscription.plan.id,
                    status: this.mapSubscriptionStatusToInvoiceStatus( subscription.statusId ),
                    amount: subscription.price || (subscription.periodId === 'monthly' ? subscription.plan.monthlyPrice : subscription.plan.annualPrice),
                    currency: subscription.plan.currencyCode || 'BRL',
                    period: subscription.periodId,
                    periodLabel: subscription.periodId === 'monthly' ? 'Mensal' : 'Anual',
                    paymentMethod: this.getPaymentMethodLabel( subscription.paymentMethodId ),
                    paymentGatewayId: subscription.paymentGatewayId,
                    description: `Plano ${subscription.plan.name} - ${subscription.periodId === 'monthly' ? 'Mensal' : 'Anual'}`,
                    chargeDetails: null
                }
                );
        } );

        return (
            {
                invoiceArray: invoiceArray,
                pagination:
                    {
                        page: input.page,
                        limit: input.limit,
                        total: historyData.count,
                        pageCount: getCeilInteger( historyData.count / input.limit )
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