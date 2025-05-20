// -- IMPORTS

import { churchService } from '../services/church_service';


// -- TYPES

export class CreateChurchUseCase
{
    // -- CONSTRUCTORS

    constructor(
        churchRepository
        )
    {
        this.churchRepository = churchRepository;
    }

    // -- OPERATIONS

    async execute(
        input
        )
    {
        let churchAlreadyExists = this.churchRepository.getChurchById( input.id );

        if ( churchAlreadyExists )
        {
            throw new 
        }

        let church = churchService.createChurch( input );
    }
}