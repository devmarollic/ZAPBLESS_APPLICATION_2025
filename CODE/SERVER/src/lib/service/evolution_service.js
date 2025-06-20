// -- IMPORTS

import { getJsonText } from 'senselogic-gist';

// -- TYPES

class EvolutionService
{
    // -- CONSTRUCTOR

    constructor(
        )
    {
        this.baseUrl = 'http://localhost:8080';
        this.cachedInstanceArray = null;
        this.cachedInstanceArrayTimestamp = null;
    }

    // -- INQUIRIES

    async getInstanceArray(
        )
    {
        let url = this.baseUrl + '/instance/fetchInstances';
        let headers = this.getHeaders();
        
        try {
            let response = await fetch(
                url,
                {
                    method: 'GET',
                    headers
                }
                );

            if ( response.status === 200 )
            {
                return response.json();
            }
            else
            {
                return null;
            }
        } catch (error) {
            return [];
        }
    }

    // ~~

    async getInstanceById(
        instanceId
        )
    {
        let url = this.baseUrl + '/instance/fetchInstances?instanceId=' + instanceId;
        let headers = this.getHeaders();
        let response = await fetch(
            url,
            {
                method: 'GET',
                headers
            }
            );

        if ( response.status === 200 )
        {
            return response.json();
        }
        else
        {
            return null;
        }
    }

    // ~~

    async getCachedInstanceArray(
        )
    {
        if ( this.cachedInstanceArray === null
            || Date.now() > this.cachedInstanceArrayTimestamp + 300000 )
        {
            this.cachedInstanceArray = await this.getInstanceArray();
            this.cachedInstanceArrayTimestamp = Date.now();
        }

        return this.cachedInstanceArray;
    }

    // ~~

    async getInstanceQrCode(
        instanceName
        )
    {
        let url = this.baseUrl + '/instance/connect/' + instanceName;
        let headers = this.getHeaders();

        let response = await fetch(
            url,
            {
                method: 'GET',
                headers
            }
            );

        if ( response.status === 200 )
        {
            return response.json();
        }
        else
        {
            return null;
        }
    }

    // ~~

    getHeaders(
        )
    {
        let headers = {};

        headers[ 'Accept' ] = 'application/json, text/plain, */*';
        headers[ 'Accept-Language' ] = 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7';
        headers[ 'Content-Type' ] = 'application/json';
        headers[ 'apikey' ] = 'KFZOm3Hc3GSNWwHBywEm67xYgjN8xGTH2';

        return headers;
    }

    // -- OPERATIONS

    async createInstance(
        instanceName,
        integration,
        token,
        number
        )
    {
        this.clearCache();

        let url = this.baseUrl + '/instance/create';
        let headers = this.getHeaders();
        let body =
            {
                instanceName,
                integration,
                token,
                number
            };

        let response = await fetch(
            url,
            {
                method: 'POST',
                headers,
                body: getJsonText( body )
            }
            );

        if ( response.status === 200 )
        {
            return response.json();
        }
        else
        {
            return null;
        }
    }

    // ~~

    async disconnectInstance(
        instanceName
        )
    {
        this.clearCache();

        let url = this.baseUrl + '/instance/logout/' + instanceName;
        let headers = this.getHeaders();

        let response = await fetch(
            url,
            {
                method: 'DELETE',
                headers
            }
            );

        if ( response.status === 200 )
        {
            return response.json();
        }
        else
        {
            return null;
        }
    }

    // ~~

    async sendTemplateByIntanceName(
        instanceName
        )
    {
        let url = this.baseUrl + '/instance/sendTemplate/' + instanceName;
        let headers = this.getHeaders();
        let body =
        {
            number: '5512981606045',
            templateMessage:
                {
                    name: '',
                    components:
                        [
                            {
                                type: 'header',
                                'sub_type': 'quick_reply',
                                index: '1',
                                parameters:
                                    [
                                        {
                                            type: 'payload',
                                            text: 'teste'
                                        }
                                    ]
                            }
                        ]
                }
        };

        let response = await fetch(
            url,
            {
                method: 'POST',
                headers,
                body: getJsonText( body )
            }
            );

        if ( response.status === 200 )
        {
            return response.json();
        }
        else
        {
            return null;
        }
    }

    // ~~

    async sendTextByIntanceNameAndNumber(
        instanceName,
        number,
        text
        )
    {
        let url = this.baseUrl + '/message/sendText/' + instanceName;
        let headers = this.getHeaders();
        let body =
        {
            number,
            text
        };

        let response = await fetch(
            url,
            {
                method: 'POST',
                headers,
                body: getJsonText( body )
            }
            );

        if ( response.status === 200 )
        {
            return response.json();
        }
        else
        {
            return null;
        }
    }

    // ~~

    clearCache(
        )
    {
        this.cachedInstanceArray = null;
        this.cachedInstanceArrayTimestamp = null;
    }
}

// -- VARIABLES

export let evolutionService = new EvolutionService();