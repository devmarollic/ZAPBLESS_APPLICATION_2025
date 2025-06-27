// -- IMPORTS

import { CreditCardPaymentStrategy } from './credit_card_payment_strategy.js';
import { DebitCardPaymentStrategy } from './debit_card_payment_strategy.js';
import { BoletoPaymentStrategy } from './boleto_payment_strategy.js';
import { PixPaymentStrategy } from './pix_payment_strategy.js';

// -- TYPES

export class PaymentStrategyFactory
{
    // -- OPERATIONS

    static createStrategy(
        paymentMethod,
        paymentService
        )
    {
        switch ( paymentMethod )
        {
            case 'credit_card':
                return new CreditCardPaymentStrategy( paymentService );

            case 'debit_card':
                return new DebitCardPaymentStrategy( paymentService );

            case 'boleto':
                return new BoletoPaymentStrategy( paymentService );

            case 'pix':
                return new PixPaymentStrategy( paymentService );

            default:
                throw new Error( `Unsupported payment method: ${ paymentMethod }` );
        }
    }

    // ~~

    static getSupportedMethods(
        )
    {
        return [ 'credit_card', 'debit_card', 'boleto', 'pix' ];
    }

    // ~~

    static isValidPaymentMethod(
        paymentMethod
        )
    {
        return this
            .getSupportedMethods()
            .includes( paymentMethod );
    }
} 