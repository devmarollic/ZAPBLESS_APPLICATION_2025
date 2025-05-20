// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { subscriptionService } from '../service/subscription_service';
// -- CONSTANTS

const relavantEventSet = new Set(
    [
        'subscription.paid',
        'subscription.canceled',
        'invoice.payment_failed',
        'subscription.created',
        'subscription.charged',
        'subscription.updated',
        'invoice.payment_succeeded'
    ]
    );

// -- TYPES

class SubscriptionWebhookUseCase
{
    // -- OPERATIONS

    async execute(
        input
        )
    {
        console.log( 'SubscriptionWebhookUseCase', { input } );
        let { type, id } = input.event;

        if ( !relavantEventSet.has( type ) )
        {
            return (
                {
                    received: false,
                    reason: 'irrelevant-event'
                }
                );
        }

        try
        {
            switch ( type )
            {
                case 'subscription.paid':
                case 'invoice.payment_succeeded':
                    await subscriptionService.setSubscriptionByPaymentGatewayId(
                        {
                            statusId: 'paid',
                            typeId: 'active'
                        },
                        id
                        );

                    break;

                case 'subscription.canceled':
                case 'invoice.payment_failed':
                    await subscriptionService.setSubscriptionByPaymentGatewayId(
                        {
                            statusId: 'canceled',
                            typeId: 'inactive'
                        },
                        id
                        );

                    break;

                default:
                    throw new AppError(
                        'unhandled-webhook-event',
                        500
                        );
            }
        }
        catch ( error )
        {
            logError( error );
        }

        return (
            {
                received: true
            }
            );
    }
}

// -- VARIABLES

export const subscriptionWebhookUseCase
    = new SubscriptionWebhookUseCase();