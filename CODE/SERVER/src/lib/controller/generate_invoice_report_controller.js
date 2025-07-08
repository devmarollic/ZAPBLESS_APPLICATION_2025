// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { reportAdapter } from '../adapter/report_adapter.js';
import { mailer } from '../../mailer.js';
import { isNullOrUndefined } from '../../base.js';
import { UnauthenticatedError } from '../errors/unauthenticated_error.js';
import { subscriptionService } from '../service/subscription_service.js';
import { planService } from '../service/plan_service.js';
import { churchService } from '../service/church_service.js';
import { NotFoundError } from '../errors/not_found.js';

// -- TYPES

export class GenerateInvoiceReportController
{
    // -- OPERATIONS

    async handle(
        request,
        response
        )
    {
        let profileLogged = request.profileLogged;

        if ( isNullOrUndefined( profileLogged ) )
        {
            throw new UnauthenticatedError();
        }

        let churchId = profileLogged.user_metadata?.church_id;
        let profileEmail = profileLogged.email;
        let profileName = [ profileLogged.user_metadata?.first_name, profileLogged.user_metadata?.last_name ].filter( Boolean ).join( ' ' );
        let subscription = await subscriptionService.getSubscriptionByChurchId( churchId );

        if ( isNullOrUndefined( subscription ) )
        {
            throw new NotFoundError( 'Subscription not found' );
        }

        let plan = await planService.getPlanById( subscription.planId );

        if ( isNullOrUndefined( plan ) )
        {
            throw new NotFoundError( 'Plan not found' );
        }

        let church = await churchService.getChurchById( churchId );
        if ( isNullOrUndefined( church ) )
        {
            throw new NotFoundError( 'Church not found' );
        }

        let invoiceNumber = subscription.paymentGatewayId || subscription.id;
        let invoiceDate = new Date( subscription.startAtDateTimestamp ).toLocaleDateString( 'pt-BR' );
        let dueDate = new Date( subscription.expiresAtDateTimestamp ).toLocaleDateString( 'pt-BR' );
        let amount = subscription.price || ( subscription.periodId === 'monthly' ? plan.monthlyPrice : plan.annualPrice );
        let amountFormatted = new Intl.NumberFormat( 'pt-BR', { style: 'currency', currency: plan.currencyCode || 'BRL' } ).format( amount );
        let billingPeriod = subscription.periodId === 'monthly' ? 'Mensal' : 'Anual';
        let paymentMethod = ( subscription.paymentMethodId === 'credit_card' ? 'Cartão de Crédito' : subscription.paymentMethodId === 'debit_card' ? 'Cartão de Débito' : subscription.paymentMethodId === 'boleto' ? 'Boleto Bancário' : subscription.paymentMethodId === 'pix' ? 'PIX' : 'Não informado' );
        let nextBillingDate = subscription.expiresAtDateTimestamp ? new Date( subscription.expiresAtDateTimestamp ).toLocaleDateString( 'pt-BR' ) : '';
        let currentYear = new Date().getFullYear();

        let context = {
            customerName: profileName,
            customerEmail: profileEmail,
            invoiceNumber,
            invoiceDate,
            dueDate,
            amountFormatted,
            planName: plan.name,
            billingPeriod,
            paymentMethod,
            nextBillingDate,
            invoiceUrl: '',
            currentYear
        };

        let pdfBuffer = await reportAdapter.generateReportPdf( 'subscription', context );

        await mailer.sendEmail(
            profileEmail,
            'Fatura de Assinatura',
            'subscription',
            context,
            [
                {
                    filename: 'fatura.pdf',
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        );

        return response.status( StatusCodes.OK ).send( { message: 'Fatura enviada com sucesso.' } );
    }
} 