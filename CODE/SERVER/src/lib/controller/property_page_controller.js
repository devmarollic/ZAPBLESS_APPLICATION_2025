// -- IMPORTS

import { propertyService } from '../service/property_service';
import { PageController } from './page_controller';

// -- TYPES

export class PropertyPageController extends PageController
{
    // -- OPERATIONS

    async processRequest(
        request,
        reply
        )
    {
        return (
            {
                property : await propertyService.getPropertyById( request.params.id )
            }
            );
    }
}
