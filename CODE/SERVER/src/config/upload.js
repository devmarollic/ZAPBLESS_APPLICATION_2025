// -- IMPORTS

import { getSupabaseServiceClient } from './auth.js';
import { z } from 'zod';

// -- CONSTANTS

const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const STORAGE_BUCKETS = {
    CHURCH_MEDIA: 'church-media',
    USER_AVATARS: 'user-avatars',
    EVENT_IMAGES: 'event-images',
    DOCUMENTS: 'documents'
};

// -- TYPES

const uploadFileSchema = z.object(
    {
        fileName: z.string().min( 1 ),
        fileBuffer: z.instanceof( Buffer ),
        mimeType: z.enum( ALLOWED_FILE_TYPES ),
        bucketName: z.enum( Object.values( STORAGE_BUCKETS ) ),
        churchId: z.string().uuid()
    }
);

// -- FUNCTIONS

async function uploadFile( uploadData )
{
    const validatedData = uploadFileSchema.parse( uploadData );
    
    const { fileName, fileBuffer, mimeType, bucketName, churchId } = validatedData;
    
    if ( fileBuffer.length > MAX_FILE_SIZE )
    {
        throw new Error( `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB` );
    }
    
    const supabase = getSupabaseServiceClient();
    const filePath = `${churchId}/${Date.now()}-${fileName}`;
    
    const { data, error } = await supabase.storage
        .from( bucketName )
        .upload( filePath, fileBuffer, {
            contentType: mimeType,
            upsert: false
        });
    
    if ( error )
    {
        throw new Error( `Upload failed: ${error.message}` );
    }
    
    return {
        filePath: data.path,
        publicUrl: getPublicUrl( bucketName, data.path )
    };
}

function getPublicUrl( bucketName, filePath )
{
    const supabase = getSupabaseServiceClient();
    
    const { data } = supabase.storage
        .from( bucketName )
        .getPublicUrl( filePath );
    
    return data.publicUrl;
}

async function deleteFile( bucketName, filePath )
{
    const supabase = getSupabaseServiceClient();
    
    const { error } = await supabase.storage
        .from( bucketName )
        .remove( [filePath] );
    
    if ( error )
    {
        throw new Error( `Delete failed: ${error.message}` );
    }
    
    return true;
}

function validateFileType( mimeType )
{
    return ALLOWED_FILE_TYPES.includes( mimeType );
}

function validateFileSize( fileSize )
{
    return fileSize <= MAX_FILE_SIZE;
}

// -- STATEMENTS

export {
    uploadFile,
    getPublicUrl,
    deleteFile,
    validateFileType,
    validateFileSize,
    STORAGE_BUCKETS,
    MAX_FILE_SIZE,
    ALLOWED_FILE_TYPES
}; 