// -- IMPORTS

import { getMapByCode, logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- FUNCTIONS

class SubscriptionService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
    }

    // -- INQUIRIES

    async getSubscriptionByChurchId(
        churchId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .eq( 'churchId', churchId )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addSubscription(
        subscription
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .insert( subscription )
                .select()
                .single();


        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setSubscriptionByChurchId(
        subscription,
        churchId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .update( subscription )
                .eq( 'churchId', churchId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setSubscriptionById(
        subscription,
        id
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .update( subscription )
                .eq( 'id', id );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    async setSubscriptionByPaymentGatewayId(
        subscription,
        paymentGatewayId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .update( subscription )
                .eq( 'paymentGatewayId', paymentGatewayId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeSubscriptionByChurchId(
        churchId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .delete()
                .eq( 'churchId', churchId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let subscriptionService
    = new SubscriptionService();
