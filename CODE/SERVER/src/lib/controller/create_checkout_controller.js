// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { PageController } from './page_controller';

// -- TYPES

export class CreateCheckoutController extends PageController
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let { body } = request;

        let { user, session } = await authentificationService.signInUser(
            body.email,
            body.password
            );

        return reply.status( StatusCodes.OK ).send( { user, session } );
    }
}
