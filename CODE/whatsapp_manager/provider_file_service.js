// -- IMPORTS

import fs from 'fs/promises';
import path from 'path';
import { getJsonObject, getJsonText, logError } from './utils.js';
import { BufferJSON } from '@whiskeysockets/baileys';

// -- TYPES

export class ProviderFiles
{
    // -- CONSTRUCTOR

    constructor(
        module
        )
    {
        this.logger = console.log;
        this.baseDir = path.resolve( process.env.SESSION_BASE_DIR || './sessions' );
    }

    // -- INQUIRIES

    getPath(
        instance,
        key
        )
    {
        return key
            ? path.join( this.baseDir, instance, key )
            : path.join( this.baseDir, instance );
    }

    // ~~

    async read(
        instance,
        key
        )
    {
        try
        {
            let filePath = this.getPath( instance, key );
            let raw = await fs.readFile( filePath, 'utf-8' );

            return [ { status: 200, data: raw } ];
        }
        catch ( error )
        {
            // Não loga erro para arquivos que não existem (comum durante inicialização)
            if ( error.code !== 'ENOENT' )
            {
                logError( error );
            }

            return [ undefined, error ];
        }
    }

    // ~~

    async allInstances(
        )
    {
        try
        {
            let dirList = await fs.readdir( this.baseDir );

            return (
                [
                    {
                        status: 200,
                        data: dirList
                    }
                ]
            );
        }
        catch ( error )
        {
            logError( error );

            return [ undefined, error ];
        }
    }

    // -- OPERATIONS

    async create(
        instance
        )
    {
        try
        {
            const dir = this.getPath(instance);
            await fs.mkdir(dir, { recursive: true });
            return [ { status: 201 } ];
        }
        catch ( error )
        {
            logError( error );

            return [ undefined, error ];
        }
    }

    // ~~

    async write(
        instance,
        key,
        data
        )
    {
        try
        {
            let filePath = this.getPath( instance, key );
            await fs.writeFile( filePath, typeof data === 'string' ? data : getJsonText( data ) );

            return (
                [
                    {
                        status: 200,
                        data: data
                    }
                ]
                );
        }
        catch ( error )
        {
            logError( error );

            return [ undefined, error ];
        }
    }

    // ~~

    async delete(
        instance,
        key
        )
    {
        try
        {
            let filePath = this.getPath( instance, key );
            await fs.unlink( filePath );

            return (
                [
                    {
                        status: 204
                    }
                ]
                );
        }
        catch ( error )
        {
            // Não loga erro para arquivos que não existem
            if ( error.code !== 'ENOENT' )
            {
                logError( error );
            }

            return [ undefined, error ];
        }
    }

    // ~~

    async removeSession(
        instance
        )
    {
        try
        {
            let dir = this.getPath( instance );
            await fs.rm( dir, { recursive: true, force: true } );

            return (
                [
                    {
                        status: 200
                    }
                ]
                );
        }
        catch ( error )
        {
            logError( error );

            return [ undefined, error ];
        }
    }
}
