// -- IMPORTS

import { CreditCardPaymentStrategy } from './credit_card_payment_strategy.js';
import { DebitCardPaymentStrategy } from './debit_card_payment_strategy.js';
import { BoletoPaymentStrategy } from './boleto_payment_strategy.js';

// -- TYPES

export class PaymentStrategyFactory
{
    // -- OPERATIONS

    static createStrategy(
        paymentMethod,
        pagarmeService
        )
    {
        switch ( paymentMethod )
        {
            case 'credit_card':
                return new CreditCardPaymentStrategy( pagarmeService );

            case 'debit_card':
                return new DebitCardPaymentStrategy( pagarmeService );

            case 'boleto':
                return new BoletoPaymentStrategy( pagarmeService );

            default:
                throw new Error( `Unsupported payment method: ${ paymentMethod }` );
        }
    }

    // ~~

    static getSupportedMethods(
        )
    {
        return [ 'credit_card', 'debit_card', 'boleto' ];
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