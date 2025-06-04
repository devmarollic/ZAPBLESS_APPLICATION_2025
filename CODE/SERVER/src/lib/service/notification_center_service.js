// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { logError } from 'senselogic-gist';
import { supabaseService } from './supabase_service';

// -- TYPES

class NotificationCenterService
{
    // -- INQUIRIES

    async getNotificationById(
        id
        )
    {
        let { data, error } = await supabaseService
            .getClient()
            .from( 'NOTIFICATION_CENTER' )
            .select()
            .eq( 'id', id )
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getNotificationArrayByChurchId(
        churchId
        )
    {
        let { data, error } = await supabaseService
            .getClient()
            .from( 'NOTIFICATION_CENTER' )
            .select()
            .eq( 'churchId', churchId )
            .order( 'creationTimestamp', { ascending: false } );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addNotification(
        notificationData
        )
    {
        let { data, error } = await supabaseService
            .getClient()
            .from( 'NOTIFICATION_CENTER' )
            .insert(
                {
                    id: getRandomTuid(),
                    ...notificationData
                }
            )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setNotificationById(
        notification,
        id
        )
    {
        let { data, error } = await supabaseService
            .getClient()
            .from( 'NOTIFICATION_CENTER' )
            .update( notification )
            .eq( 'id', id )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async markNotificationAsRead(
        id
        )
    {
        let { data, error } = await supabaseService
            .getClient()
            .from( 'NOTIFICATION_CENTER' )
            .update(
                {
                    isReaded: true,
                    updateTimestamp: new Date().toISOString()
                }
            )
            .eq( 'id', id )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let notificationCenterService =
    new NotificationCenterService(); 