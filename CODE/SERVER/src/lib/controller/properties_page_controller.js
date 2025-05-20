// -- IMPORTS

import { propertyService } from '../service/property_service';
import { PageController } from './page_controller';

// -- TYPES

export class PropertiesPageController extends PageController
{
    // -- OPERATIONS

    async processRequest(
        request,
        reply
        )
    {
        return (
            {
                propertyArray : await propertyService.getPropertyArray()
            }
            );
    }
}
