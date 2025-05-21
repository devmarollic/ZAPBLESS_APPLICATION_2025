// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { Controller } from './controller';

// -- TYPES

export class CreateCheckoutController extends Controller
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
