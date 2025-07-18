// -- TYPES

import { WebhookController } from './webhook_controller.js';

export class EventManager
{
    // -- CONSTRUCTOR

    constructor(
        supabaseRepository,
        whatsappMonitor
        )
    {
        this.supabaseRepository = supabaseRepository;
        this.whatsappMonitor = whatsappMonitor;

        this.webhook = new WebhookController( supabaseRepository, whatsappMonitor );
        // this.rabbitmq = new RabbitmqController(prismaRepository, waMonitor);
    }

    // -- OPERATIONS
}