// -- IMPORTS

import { AppError } from '../../domain/errors';

// -- TYPES

export class DomainEvent
{
    // -- CONSTRUCTORS

    constructor(
        id,
        occurredOn = Date.now()
        )
    {
        if ( new.target === DomainEvent )
        {
            throw new AppError( 'Cannot construct Abstract instances directly' );
        }

        this.id = id;
        this.occurredOn = occurredOn;
    }
}