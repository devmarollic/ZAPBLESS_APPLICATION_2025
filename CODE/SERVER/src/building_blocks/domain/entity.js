// -- IMPORTS

import { AppError } from '../../domain/errors';
import { DomainEvent } from './event';

// -- TYPES

export class Entity
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.domainEventArray_ = [];
    }

    // -- INQUIRIES

    checkRule(
        rule
        )
    {
        if ( rule.isBroken() )
        {
            throw new AppError( rule );
        }
    }

    // ~~

    get domainEventArray()
    {
        return [ ...this.domainEventArray_ ];
    }

    // -- OPERATIONS

    clearDomainEventArray(
        )
    {
        this.domainEventArray_ = [];
    }

    // ~~

    addDomainEvent(
        domainEvent
        )
    {
        if ( !( domainEvent instanceof DomainEvent ) )
        {
            throw new AppError( 'Event must be an instance of DomainEvent' );
        }

        this.domainEventArray.push( domainEventArray_ );
    }
}