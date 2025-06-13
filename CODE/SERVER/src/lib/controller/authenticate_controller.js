// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { authentificationService } from '../service/authentification_service';
import { permissionValidationService } from '../service/permission_validation_service';
import { Controller } from './controller';

// -- TYPES

export class AuthenticateController extends Controller
{
    // -- OPERATIONS

    async handle(
        request,
        reply
        )
    {
        let { body } = request;

        try
        {
            // First validate user permissions before attempting authentication
            await permissionValidationService.validateUserPermissionByEmail( body.email );

            // If validation passes, proceed with authentication
            let { user, session, error } = await authentificationService.signInUser(
                body.email,
                body.password
                );

            return reply.status( StatusCodes.OK ).send( { user, session } );
        }
        catch ( error )
        {
            // Handle permission validation errors or authentication errors
            let statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
            let message = error.message || 'Authentication failed';
            
            return reply.status( statusCode ).send( { 
                error: error.code || 'AUTHENTICATION_ERROR',
                message: message
            } );
        }
    }
}
