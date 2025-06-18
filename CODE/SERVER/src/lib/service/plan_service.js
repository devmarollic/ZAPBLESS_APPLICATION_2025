// -- IMPORTS

import { getMapById, logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- FUNCTIONS

class PlanService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedPlanArray = null;
        this.cachedPlanArrayTimestamp = 0;
        this.cachedPlanByIdMap = null;
    }

    // -- INQUIRIES

    async getPlanArray(
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'PLAN' )
                .select()
                .order( 'number', { ascending: true } );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCachedPlanArray(
        )
    {
        if ( this.cachedPlanArray === null
            || Date.now() > this.cachedPlanArrayTimestamp + 300000 )
       {
           this.cachedPlanArray = await this.getPlanArray();
           this.cachedPlanArrayTimestamp = Date.now();
       }

       return this.cachedPlanArray;
    }

    // ~~~

    async getCachedPlanByIdMap(
        )
    {
        if ( this.cachedPlanByIdMap === null
            || Date.now() > this.cachedPlanByIdMapTimestamp + 300000 )
        {
            this.cachedPlanArray = await this.getCachedPlanArray();
            this.cachedPlanByIdMap = getMapById( this.cachedPlanArray, 'id' );
            this.cachedPlanByIdMapTimestamp = Date.now();
        }

        return this.cachedPlanByIdMap;
    }

    // ~~

    async getPlanById(
        id
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'PLAN' )
            .select()
            .eq( 'id', id )
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedPlanArray = null;
        this.cachedPlanArrayTimestamp = 0;
        this.cachedPlanByIdMap = null;
    }
}

// -- VARIABLES

export let planService
    = new PlanService();
