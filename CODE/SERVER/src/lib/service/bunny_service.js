// -- IMPORTS

import fs from 'fs';

// -- TYPES

class BunnyService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.baseUrl = process.env.FUSION_PROJECT_BUNNY_STORAGE_URL;
        this.storageZoneName = process.env.FUSION_PROJECT_BUNNY_STORAGE_ZONE_NAME;
        this.apiKey = process.env.FUSION_PROJECT_BUNNY_STORAGE_API_KEY;
    }

    // -- INQUIRIES

    getFileUrl(
        filePath
        )
    {
        return this.baseUrl + '/' + this.storageZoneName + '/' + filePath;
    }

    // ~~

    async uploadFile(
        localFile,
        storageFilePath
        )
    {
        try
        {
            let response =
                await fetch(
                    this.getFileUrl( storageFilePath ),
                    {
                        method : 'PUT',
                        headers :
                            {
                                'AccessKey' : this.apiKey,
                                'Content-Type' : 'application/octet-stream'
                            },
                        body : localFile
                    }
                    );

            if ( !response.ok )
            {
                throw new Error( 'Failed to upload file: ' + response.statusText );
            }

            let data = await response.json();

            return data;
        }
        catch ( error )
        {
            console.error( "Error uploading file to Bunny CDN:", error );

            return null;
        }
    }

    // ~~

    async removeFile(
        storageFilePath
        )
    {
        try
        {
            let response =
                await fetch(
                    this.getFileUrl( storageFilePath ),
                    {
                        method : 'DELETE',
                        headers :
                            {
                                'AccessKey' : this.apiKey
                            }
                    }
                    );

            if ( !response.ok )
            {
                throw new Error( 'Failed to remove file: ' + response.statusText );
            }

            let data = await response.json();

            return data;
        }
        catch ( error )
        {
            console.error( "Error removing file from Bunny CDN:", error );

            return null;
        }
    }
}

// -- VARIABLES

export let bunnyService
    = new BunnyService();
