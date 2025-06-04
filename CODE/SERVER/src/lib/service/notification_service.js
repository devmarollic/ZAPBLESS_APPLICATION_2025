// -- IMPORTS

import { logError } from 'senselogic-gist';
import { whatsappService } from './whatsapp_service';
import { notificationCenterService } from './notification_center_service';

// -- TYPES

class NotificationService
{
    // -- OPERATIONS

    async sendNotification(
        notificationData
        )
    {
        try
        {
            switch ( notificationData.notificationMediumId )
            {
                case 'whatsapp':
                    await this.sendWhatsAppNotification( notificationData );
                    break;

                case 'notification_center':
                    await this.sendNotificationCenterNotification( notificationData );
                    break;

                default:
                    throw new Error( `Unsupported notification medium: ${notificationData.notificationMediumId}` );
            }
        }
        catch ( error )
        {
            logError( error );
            throw error;
        }
    }

    // ~~

    async sendWhatsAppNotification(
        notificationData
        )
    {
        const { churchId, payload } = notificationData;
        
        const whatsapp = await whatsappService.getDefaultWhatsAppByChurchId( churchId );
        
        if ( !whatsapp )
        {
            throw new Error( 'No WhatsApp instance found for this church' );
        }

        for ( const contact of payload )
        {
            await whatsapp.sendMessage(
                `${ contact.number }@c.us`,
                contact.message
            );
        }
    }

    // ~~

    async sendNotificationCenterNotification(
        notificationData
        )
    {
        const { churchId, notificationTypeId, payload } = notificationData;

        await notificationCenterService.addNotification(
            {
                churchId,
                notificationTypeId,
                message: payload[ 0 ].message,
                source: 'event_schedule',
                severityId: 'info',
                isReaded: false
            }
        );
    }
}

// -- VARIABLES

export let notificationService =
    new NotificationService(); 