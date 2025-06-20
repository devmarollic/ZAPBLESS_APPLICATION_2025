// -- IMPORTS

import { Controller } from './controller';
import { evolutionService } from '../service/evolution_service';

// -- CONSTANTS

const relevantEventSet = new Set(
    [
        'logout.instance'
    ]
    );

// -- TYPES

export class WebhookWhatsappController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        // let token = request.headers[ 'x-evolution-token' ];

        // if ( token !== enviroment.EVOLUTION_TOKEN )
        // {
        //     throw new UnauthorizedError();
        // }

        let { body } = request;

        let { event } = body;

        console.log( 'DEBUG: event: [ ', event, ' ]:    ', body );

        if ( relevantEventSet.has( event ) )
        {
            switch ( event )
            {
                case 'logout.instance':
                    evolutionService.clearCache();
                    break;
            }
        }

    }
}