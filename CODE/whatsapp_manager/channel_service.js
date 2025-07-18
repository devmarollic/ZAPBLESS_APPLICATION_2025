import { EventEmitter } from 'events';
import { WAMonitoringService } from './wamonitor_service.js';
import { EventManager } from './event_emitter.js';

export class ChannelService
{
    // -- CONSTRUCTOR

    constructor(
        )
    {
        this.eventEmitter = new EventEmitter();

        this.instance = {};
        this.instance.name = process.env.INSTANCE_NAME;
        this.instance.id = process.env.CHURCH_ID;
        this.instance.integration = 'WhatsApp';
        this.instance.number = process.env.CHURCH_NUMBER;
        this.instance.token = process.env.CHURCH_TOKEN;
        this.instance.businessId = process.env.CHURCH_BUSINESS_ID;
    }
    
    // -- OPERATIONS

    async sendDataWebhook(
        event,
        data,
        local = true,
        integration
        )
    {
        const serverUrl = process.env.SERVER_URL;
        const timezoneOffset = new Date().getTimezoneOffset() * 60000;
        const localISOTime = new Date( Date.now() - timezoneOffset ).toISOString();
        const now = localISOTime;
    
        const expose = process.env.EXPOSE_IN_FETCH_INSTANCES;
    
        const instanceApikey = process.env.TOKEN || 'Apikey not found';
    
        await eventManager.emit(
            {
                instanceName: this.instance.name,
                origin: ChannelService.name,
                event,
                data,
                serverUrl,
                dateTime: now,
                sender: this.wuid,
                apiKey: expose && instanceApikey ? instanceApikey : null,
                local,
                integration,
            }
            );
      }
}