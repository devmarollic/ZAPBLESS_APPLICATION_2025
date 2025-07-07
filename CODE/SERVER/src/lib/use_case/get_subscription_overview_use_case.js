// -- IMPORTS

import { subscriptionService } from '../service/subscription_service';
import { planService } from '../service/plan_service';
import { ValidationError } from '../errors/validation_error';
import { subscriptionStatus, subscriptionType } from '../model/subscription';

// -- TYPES

class GetSubscriptionOverviewUseCase {
    // -- OPERATIONS

    async execute(
        input
        )
    {
        this.validateInput( input );

        let subscription = await subscriptionService.getSubscriptionByChurchId( input.churchId );

        if (!subscription)
        {
            return (
                {
                    currentPlan: null,
                    nextBilling: null,
                    invoiceHistory:
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
                }
                );
        }

        let planByIdMap = await planService.getCachedPlanByIdMap();
        let plan = planByIdMap[ subscription.planId ];

        if ( !plan )
        {
            throw new ValidationError( 'Plan not found' );
        }

        let currentPlan = this.buildCurrentPlanDetails( subscription, plan );
        let nextBilling = this.buildNextBillingDetails( subscription, plan );
        let invoiceHistory = await this.buildInvoiceHistory( input.churchId, input.page, input.limit );

        return (
            {
                currentPlan,
                nextBilling,
                invoiceHistory
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

    buildCurrentPlanDetails(
        subscription,
        plan
        )
    {
        return (
            {
                id: subscription.id,
                planId: plan.id,
                planName: plan.name,
                description: plan.description,
                status: subscription.statusId,
                statusLabel: this.getStatusLabel(subscription.statusId),
                type: subscription.typeId,
                typeLabel: this.getTypeLabel(subscription.typeId),
                period: subscription.periodId,
                periodLabel: subscription.periodId === 'monthly' ? 'Mensal' : 'Anual',
                currentAmount: subscription.price || (subscription.periodId === 'monthly' ? plan.monthlyPrice : plan.annualPrice),
                currency: plan.currencyCode || 'BRL',
                startDate: subscription.startAtDateTimestamp,
                expiresAt: subscription.expiresAtDateTimestamp,
                paymentMethod: subscription.paymentMethodId,
                paymentMethodLabel: this.getPaymentMethodLabel(subscription.paymentMethodId),
                isActive: subscription.statusId === subscriptionStatus.paid && subscription.typeId === subscriptionType.active,
                featureArray: plan.featureArray
            }
            );
    }

    buildNextBillingDetails(
        subscription,
        plan
        )
    {
        if ( subscription.typeId !== subscriptionType.active
             || subscription.statusId !== subscriptionStatus.paid )
        {
            return null;
        }

        let nextBillingDate = this.calculateNextBillingDate( subscription.expiresAtDateTimestamp, subscription.periodId );
        let amount = subscription.periodId === 'monthly' ? plan.monthlyPrice : plan.annualPrice;

        return (
            {
                date: nextBillingDate,
                amount,
                currency: plan.currencyCode || 'BRL',
                planName: plan.name,
                period: subscription.periodId,
                periodLabel: subscription.periodId === 'monthly' ? 'Mensal' : 'Anual',
                description: `Próxima cobrança - Plano ${ plan.name } - ${ subscription.periodId === 'monthly' ? 'Mensal' : 'Anual' }`,
                paymentMethod: subscription.paymentMethodId,
                paymentMethodLabel: this.getPaymentMethodLabel( subscription.paymentMethodId )
            }
            );
    }

    async buildInvoiceHistory(
        churchId,
        page,
        limit
        )
    {
        let historyData = await subscriptionService.getSubscriptionHistoryByChurchId( churchId, page, limit );

        let invoiceArray = historyData.data.map(
            subscription =>
            {
                return (
                    {
                        id: subscription.paymentGatewayId || subscription.id,
                        subscriptionId: subscription.id,
                        date: subscription.startAtDateTimestamp,
                        dueDate: subscription.expiresAtDateTimestamp,
                        description: `Plano ${ subscription.plan.name } - ${ subscription.periodId === 'monthly' ? 'Mensal' : 'Anual' }`,
                        status: subscription.statusId,
                        statusLabel: this.getStatusLabel( subscription.statusId ),
                        amount: subscription.price || ( subscription.periodId === 'monthly' ? subscription.plan.monthlyPrice : subscription.plan.annualPrice ),
                        currency: subscription.plan.currencyCode || 'BRL',
                        period: subscription.periodId,
                        periodLabel: subscription.periodId === 'monthly' ? 'Mensal' : 'Anual',
                        planName: subscription.plan.name,
                        paymentMethod: subscription.paymentMethodId,
                        paymentMethodLabel: this.getPaymentMethodLabel( subscription.paymentMethodId ),
                        paymentGatewayId: subscription.paymentGatewayId,
                        isCurrentInvoice: true
                    }
                    );
            }
            );

        return (
            {
                invoiceArray: invoiceArray,
                pagination:
                    {
                        page,
                        limit,
                        total: historyData.count,
                        pageCount: Math.ceil(historyData.count / limit)
                    }
            }
            );
    }

    getStatusLabel(
        statusId
        )
    {
        let statusMap =
            {
                'paid': 'Pago',
                'pending': 'Pendente',
                'canceled': 'Cancelado',
                'refused': 'Recusado',
                'expired': 'Expirado'
            };

        return statusMap[ statusId ] || statusId;
    }

    getTypeLabel(
        typeId
        )
    {
        let typeMap =
            {
                'active': 'Ativo',
                'trial': 'Teste',
                'canceled': 'Cancelado'
            };

        return typeMap[ typeId ] || typeId;
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

    calculateNextBillingDate(
        currentExpirationDate,
        period
        )
    {
        let date = new Date( currentExpirationDate );

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

export const getSubscriptionOverviewUseCase =
    new GetSubscriptionOverviewUseCase(); 