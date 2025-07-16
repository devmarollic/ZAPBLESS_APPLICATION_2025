// -- IMPORTS

import { ListCityController } from '../controller/list_city_controller';
import { ListCityByProvinceCodeController } from '../controller/list_city_by_province_code_controller';

// -- CONSTANTS

const listCityController = new ListCityController();
const listCityByProvinceCodeController = new ListCityByProvinceCodeController();

// -- FUNCTIONS

export async function cityRoutes(
    fastify,
    options
    )
{
    fastify.get(
        '/list',
        ( request, response ) => listCityController.handle( request, response )
        );

    fastify.get(
        '/:provinceCode/list',
        ( request, response ) => listCityByProvinceCodeController.handle( request, response )
        );
}

