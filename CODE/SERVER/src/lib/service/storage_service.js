// -- IMPORTS

import { logError } from 'senselogic-gist';
import { bunnyService } from './bunny_service';
import { supabaseService } from './supabase_service';
import { createLimitedImage } from '../base/image';

// -- TYPES

export class StorageService
{
    // -- INQUIRIES

    getFilePath(
        filePath
        )
    {
        if ( filePath.startsWith( '/global/' ) )
        {
            return process.env.FUSION_PROJECT_BUNNY_STORAGE_URL + filePath;
        }
        else if ( filePath.startsWith( '/upload/' ) )
        {
            return process.env.FUSION_PROJECT_SUPABASE_STORAGE_URL + filePath;
        }
        else
        {
            return filePath;
        }
    }

    // ~~

    getStorageImagePath(
        imagePath,
        imageWidth
        )
    {
        if ( !isNaN( imageWidth ) )
        {
            let lastDotCharacterIndex = imagePath.lastIndexOf( '.' );

            return imagePath.slice( 0, lastDotCharacterIndex ) + '.' + imageWidth + imagePath.slice( lastDotCharacterIndex );
        }
        else
        {
            return this.getFilePath( imagePath );
        }
    }

    // -- OPERATIONS

    async uploadFile(
        localFile,
        storageFilePath,
        storageFileIsOverwritten = false
        )
    {
        return await supabaseService.uploadFile( localFile, storageFilePath, storageFileIsOverwritten );
    }

    // ~~

    async removeFile(
        storageFilePath
        )
    {
        return await supabaseService.removeFile( storageFilePath );
    }

    // ~~

    async uploadGlobalFile(
        localFile,
        storageFilePath,
        storageFileIsOverwritten = false
        )
    {
        return await bunnyService.uploadFile( localFile, storageFilePath, storageFileIsOverwritten );
    }

    // ~~

    async removeGlobalFile(
        storageFilePath
        )
    {
        return await bunnyService.removeFile( storageFilePath );
    }

    // ~~

    async uploadGlobalImageFile(
        localImageFile,
        storageFilePath,
        storageFileIsOverwritten = false,
        imageWidthArray = [ 640, 1280, 1920, 3840 ],
        imageQualityArray = [ 80, 80, 80, 80 ]
        )
    {
        await supabaseService.removeFile( storageFilePath );

        for ( let imageIndex = 0;
              imageIndex < imageWidthArray.length;
              ++imageIndex )
        {
            let imageWidth = imageWidthArray[ imageIndex ];
            let imageQuality = imageQualityArray[ imageIndex ];

            resizedImage =
                createLimitedImage(
                    localImageFile,
                    imageWidth * 9 / 16,
                    imageQuality
                    );

            await bunnyService.uploadFile( resizedImage, storageFilePath + '.' + imageWidth + '.avif', storageFileIsOverwritten );
        }
    }

    // ~~

    async removeGlobalImageFile(
        storageFilePath
        )
    {
        return await bunnyService.removeFile( storageFilePath );
    }

    // ~~

    async uploadGlobalVideoFile(
        localVideoFile,
        storageFilePath,
        storageFileIsOverwritten = false
        )
    {
        return await supabaseService.uploadFile( localVideoFile, storageFilePath, storageFileIsOverwritten );
    }

    // ~~

    async removeGlobalVideoFile(
        storageFilePath
        )
    {
        return await bunnyService.removeFile( storageFilePath );
    }
}

// -- VARIABLES

export let storageService = new StorageService();
