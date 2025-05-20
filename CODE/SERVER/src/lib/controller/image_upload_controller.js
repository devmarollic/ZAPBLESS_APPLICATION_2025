import Fastify from 'fastify';
import { join } from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { format } from 'date-fns';

const fastify = Fastify();

const getCurrentDateTimeSuffix = () => format( new Date(), 'yyyyMMdd_HHmmss' );
const getValidFileName = ( name ) => name.replace( /[^a-zA-Z0-9.-]/g, '_' );
const hasSuffix = ( fileName, suffix ) => fileName.toLowerCase().endsWith( suffix.toLowerCase() );
const replaceSuffix = ( fileName, oldSuffix, newSuffix ) => fileName.replace( new RegExp( `${oldSuffix}$`, 'i' ), newSuffix );
const createFolder = async ( path ) => await fs.mkdir( path, { recursive: true } );
const moveFile = async ( source, destination ) => await fs.rename( source, destination );
const fileExists = async ( path ) => !!( await fs.stat( path ).catch( () => false ) );
const removeFile = async ( path ) => await fs.unlink( path );

class Controller
{
    constructor( languageCode )
    {
        this.languageCode = languageCode;
    }

    setStatus( status )
    {
        this.status = status;
    }

    setJsonResponse( response )
    {
        this.jsonResponse = response;
    }
}

class UploadImageController extends Controller
{
    constructor( languageCode )
    {
        super( languageCode );

        let file = this.getUploadedFile( 'File' );

        if ( file )
        {
            let sourceFilePath = file.path;
            let sourceFileName = getValidFileName( file.filename );
            let targetFileName = getValidFileName( sourceFileName + '_' + getCurrentDateTimeSuffix() );

            if ( hasSuffix( targetFileName, '.jpeg' ) )
            {
                targetFileName = replaceSuffix( targetFileName, '.jpeg', '.jpg' );
            }
            else if ( hasSuffix( targetFileName, '.JPEG' ) )
            {
                targetFileName = replaceSuffix( targetFileName, '.JPEG', '.jpg' );
            }
            else if ( hasSuffix( targetFileName, '.JPG' ) )
            {
                targetFileName = replaceSuffix( targetFileName, '.JPG', '.jpg' );
            }
            else if ( hasSuffix( targetFileName, '.PNG' ) )
            {
                targetFileName = replaceSuffix( targetFileName, '.PNG', '.png' );
            }

            let mediaFolderPath = join( __dirname, 'media', 'image' );
            let mediaFilePath = join( mediaFolderPath, targetFileName );
            createFolder( mediaFolderPath );

            if ( moveFile( sourceFilePath, mediaFilePath ) )
            {
                let targetFolderPath = join( __dirname, 'upload', 'image' );
                let targetFilePath = join( targetFolderPath, targetFileName );
                createFolder( targetFolderPath );

                if ( hasSuffix( targetFilePath, '.jpg' ) )
                {
                    this.processJpegImage( mediaFilePath, targetFilePath );
                }
                else if ( hasSuffix( targetFilePath, '.png' ) )
                {
                    this.processPngImage( mediaFilePath, targetFilePath );
                }
                else
                {
                    moveFile( mediaFilePath, targetFilePath );
                }

                this.setStatus( 201 );
                this.setJsonResponse( `/upload/image/${targetFileName}` );
            }
            else
            {
                this.setStatus( 400 );
            }
        }
    }

    async getUploadedFile( field )
    {
    }

    async processJpegImage( sourcePath, targetPath )
    {
        let image = sharp( sourcePath );
        await image.resize( { width: 1920 } ).jpeg( { quality: 70 } ).toFile( targetPath );
        await image.resize( { width: 1280 } ).jpeg( { quality: 70 } ).toFile( targetPath + '.medium.jpg' );
        await image.resize( { width: 640 } ).jpeg( { quality: 70 } ).toFile( targetPath + '.small.jpg' );
        await image.resize( { width: 320 } ).jpeg( { quality: 50 } ).toFile( targetPath + '.preload.jpg' );
    }

    async processPngImage( sourcePath, targetPath )
    {
        let image = sharp( sourcePath );
        let { isOpaque } = await image.stats();

        if ( isOpaque )
        {
            let targetFileName = replaceSuffix( targetPath, '.png', '.jpg' );
            await this.processJpegImage( sourcePath, targetFileName );
        }
        else
        {
            await image.resize( { width: 1920 } ).png().toFile( targetPath );
            await image.resize( { width: 1280 } ).png().toFile( targetPath + '.medium.png' );
            await image.resize( { width: 640 } ).png().toFile( targetPath + '.small.png' );
            await image.resize( { width: 320 } ).png().toFile( targetPath + '.preload.png' );
        }
    }
}

class UploadVideoController extends Controller
{
    async constructor( languageCode )
    {
        super( languageCode );

        let file = await this.getUploadedFile( 'File' );

        if ( file )
        {
            let sourceFilePath = file.path;
            let sourceFileName = getValidFileName( file.filename );
            let targetFileName = getValidFileName( sourceFileName + '_' + getCurrentDateTimeSuffix() );
            let targetFilePath = join( __dirname, 'upload', 'video', targetFileName );

            if ( await moveFile( sourceFilePath, targetFilePath ) )
            {
                this.setStatus( 201 );
                this.setJsonResponse( `/upload/video/${targetFileName}` );
            }
            else
            {
                this.setStatus( 400 );
            }
        }
    }

    async getUploadedFile( field )
    {
    }
}

class UploadDocumentController extends Controller
{
    async constructor( languageCode )
    {
        super( languageCode );

        let file = await this.getUploadedFile( 'File' );

        if ( file )
        {
            let sourceFilePath = file.path;
            let sourceFileName = getValidFileName( file.filename );
            let targetFileName = getValidFileName( sourceFileName + '_' + getCurrentDateTimeSuffix() );
            let targetFilePath = join( __dirname, 'upload', 'document', targetFileName );

            if ( await moveFile( sourceFilePath, targetFilePath ) )
            {
                this.setStatus( 201 );
                this.setJsonResponse( `/upload/document/${targetFileName}` );
            }
            else
            {
                this.setStatus( 400 );
            }
        }
    }

    async getUploadedFile( field )
    {
    }
}

class DeleteFileController extends Controller
{
    async constructor( languageCode )
    {
        super( languageCode );

        let filePath = join( __dirname, this.getPostValue( 'FilePath' ) );

        if ( await fileExists( filePath ) && await removeFile( filePath ) )
        {
            if ( hasSuffix( filePath, '.jpg' ) )
            {
                let suffixes = [ '.original.png', '.original.jpg', '.medium.jpg', '.small.jpg', '.preload.jpg' ];

                for ( let suffix of suffixes )
                {
                    let suffixedFilePath = filePath + suffix;

                    if ( await fileExists( suffixedFilePath ) )
                    {
                        await removeFile( suffixedFilePath );
                    }
                }
            }
            else if ( hasSuffix( filePath, '.png' ) )
            {
                let suffixes = [ '.original.png', '.medium.png', '.small.png', '.preload.png' ];

                for ( let suffix of suffixes )
                {
                    let suffixedFilePath = filePath + suffix;

                    if ( await fileExists( suffixedFilePath ) )
                    {
                        await removeFile( suffixedFilePath );
                    }
                }
            }

            this.setStatus( 201 );
            this.setJsonResponse( filePath );
        }
        else
        {
            this.setStatus( 400 );
            this.setJsonResponse( filePath );
        }
    }

    getPostValue( key )
    {
    }
}

fastify.post(
    '/upload/image', async ( request, reply ) =>
    {
        let controller = new UploadImageController( request.body.language_code );
        await controller.constructor();
        reply.status( controller.status ).send( controller.jsonResponse );
    }
    );

fastify.post(
    '/upload/video', async ( request, reply ) =>
    {
        let controller = new UploadVideoController( request.body.language_code );
        await controller.constructor();
        reply.status( controller.status ).send( controller.jsonResponse );
    }
    );

fastify.post(
    '/upload/document', async ( request, reply ) =>
    {
        let controller = new UploadDocumentController( request.body.language_code );
        await controller.constructor();
        reply.status( controller.status ).send( controller.jsonResponse );
    }
    );

fastify.post(
    '/delete/file', async ( request, reply ) =>
    {
        let controller = new DeleteFileController( request.body.language_code );
        await controller.constructor();
        reply.status( controller.status ).send( controller.jsonResponse );
    }
    );

let start = async () =>
{
    try
    {
        await fastify.listen( 3000 );
        console.log( 'Server listening on http://localhost:3000' );
    }
    catch ( err )
    {
        console.error( err );
        process.exit( 1 );
    }
};

start();
