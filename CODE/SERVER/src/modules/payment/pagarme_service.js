// -- IMPORTS

import { z } from 'zod';
import { environment } from '../../config/environment.js';
import { AppError } from '../../shared/errors/app_error.js';

// -- CONSTANTS

const PAGARME_BASE_URL = 'https://api.pagar.me/core/v5';

const PLAN_DATA = [
    {
        id: 'basic',
        name: 'Iniciante',
        description: 'Perfeito para igrejas pequenas',
        monthlyPrice: 99.9,
        annualPrice: 85
    },
    {
        id: 'growth', 
        name: 'Crescimento',
        description: 'Ideal para igrejas em expansão',
        monthlyPrice: 149.9,
        annualPrice: 127.5
    },
    {
        id: 'community',
        name: 'Comunidade', 
        description: 'Para igrejas grandes e estabelecidas',
        monthlyPrice: 199.9,
        annualPrice: 170
    }
];

const PAYMENT_METHODS = [
    'credit_card',
    'boleto',
    'debit_card'
];

// -- TYPES

const planSchema = z.object(
    {
        id: z.string(),
        name: z.string(),
        description: z.string(),
        monthlyPrice: z.number().positive(),
        annualPrice: z.number().positive()
    }
);

const subscriptionSchema = z.object(
    {
        interval: z.enum( ['month', 'year'] ),
        intervalCount: z.number().int().positive().default( 1 ),
        pricingScheme: z.object(
            {
                schemeType: z.string().default( 'Unit' ),
                price: z.number().int().positive(),
                minimumPrice: z.number().int().positive()
            }
        ),
        name: z.string(),
        description: z.string(),
        paymentMethods: z.array( z.enum( PAYMENT_METHODS ) ).default( PAYMENT_METHODS ),
        currency: z.string().default( 'BRL' ),
        trialPeriodDays: z.number().int().positive().default( 14 )
    }
);

// -- FUNCTIONS

class PagarmeService
{
    constructor()
    {
        this.apiKey = environment.PAGARME_SECRET_KEY;
        this.baseUrl = PAGARME_BASE_URL;
    }
    
    getAuthHeaders()
    {
        const encodedApiKey = Buffer.from( `${this.apiKey}:` ).toString( 'base64' );
        
        return {
            'Authorization': `Basic ${encodedApiKey}`,
            'Content-Type': 'application/json'
        };
    }
    
    async makeRequest( endpoint, options = {} )
    {
        const url = `${this.baseUrl}${endpoint}`;
        const requestOptions = {
            headers: this.getAuthHeaders(),
            ...options
        };
        
        try
        {
            const response = await fetch( url, requestOptions );
            const data = await response.json();
            
            if ( !response.ok )
            {
                throw AppError.externalService( `Pagar.me API error: ${data.message || response.statusText}` );
            }
            
            return data;
        }
        catch ( error )
        {
            if ( error instanceof AppError )
            {
                throw error;
            }
            
            throw AppError.externalService( `Failed to communicate with Pagar.me: ${error.message}` );
        }
    }
    
    createSubscriptionPlan( plan, isMonthly = true )
    {
        const validatedPlan = planSchema.parse( plan );
        const price = isMonthly ? validatedPlan.monthlyPrice : validatedPlan.annualPrice;
        const priceInCents = Math.round( price * 100 );
        const intervalType = isMonthly ? 'month' : 'year';
        const planSuffix = isMonthly ? 'mensal' : 'anual';
        
        const subscriptionData = {
            interval: intervalType,
            intervalCount: 1,
            pricingScheme: {
                schemeType: 'Unit',
                price: priceInCents,
                minimumPrice: priceInCents
            },
            name: `${validatedPlan.name} ${planSuffix}`,
            description: validatedPlan.description,
            paymentMethods: PAYMENT_METHODS,
            currency: 'BRL',
            minimumPrice: priceInCents,
            statementDescriptor: `ZapBless ${validatedPlan.name.toLowerCase()}`,
            trialPeriodDays: 14,
            quantity: 1
        };
        
        return this.makeRequest( '/subscriptions', {
            method: 'POST',
            body: JSON.stringify( subscriptionData )
        });
    }
    
    async createAllSubscriptions()
    {
        const results = [];
        
        for ( const plan of PLAN_DATA )
        {
            try
            {
                // Create monthly plan
                const monthlyResult = await this.createSubscriptionPlan( plan, true );
                results.push( { plan: plan.name, type: 'monthly', result: monthlyResult } );
                
                // Wait before creating next plan
                await this.sleep( 1000 );
                
                // Create annual plan
                const annualResult = await this.createSubscriptionPlan( plan, false );
                results.push( { plan: plan.name, type: 'annual', result: annualResult } );
                
                // Wait before next plan
                await this.sleep( 1000 );
            }
            catch ( error )
            {
                results.push( { plan: plan.name, error: error.message } );
            }
        }
        
        return results;
    }
    
    async listAllSubscriptions( page = 1, size = 25 )
    {
        const endpoint = `/subscriptions?page=${page}&size=${size}`;
        
        return this.makeRequest( endpoint, { method: 'GET' } );
    }
    
    async listSubscriptionsWithFilters( status = null, page = 1, size = 25 )
    {
        let endpoint = `/subscriptions?page=${page}&size=${size}`;
        
        if ( status )
        {
            endpoint += `&status=${status}`;
        }
        
        return this.makeRequest( endpoint, { method: 'GET' } );
    }
    
    async getSubscriptionById( subscriptionId )
    {
        if ( !subscriptionId )
        {
            throw AppError.validation( 'Subscription ID is required' );
        }
        
        return this.makeRequest( `/subscriptions/${subscriptionId}`, { method: 'GET' } );
    }
    
    async cancelSubscription( subscriptionId )
    {
        if ( !subscriptionId )
        {
            throw AppError.validation( 'Subscription ID is required' );
        }
        
        return this.makeRequest( `/subscriptions/${subscriptionId}/cancel`, { method: 'POST' } );
    }
    
    sleep( milliseconds )
    {
        return new Promise( resolve => setTimeout( resolve, milliseconds ) );
    }
}

// -- STATEMENTS

const pagarmeService = new PagarmeService();

export { pagarmeService, PagarmeService, PLAN_DATA }; 