// -- IMPORTS

import { propertyService } from '../service/property_service';
import { PageController } from './page_controller';

// -- TYPES

export class HomePageController extends PageController
{
    // -- OPERATIONS

    async processRequest(
        request,
        reply
        )
    {
        return (
            {
                favoritePropertyArray : await propertyService.getFavoritePropertyArray()
            }
            );
    }
}
