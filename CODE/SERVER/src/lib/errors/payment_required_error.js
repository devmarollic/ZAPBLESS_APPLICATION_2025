// -- IMPORTS

import { AppError } from './app_error';
import { StatusCodes } from 'http-status-codes';

// -- TYPES

export class PaymentRequiredError extends AppError
{
    // -- CONSTRUCTORS

    constructor(
        message = 'peyment-required-error-message',
        statusCode = StatusCodes.PAYMENT_REQUIRED
        )
    {
        super( message, statusCode );
    }
}