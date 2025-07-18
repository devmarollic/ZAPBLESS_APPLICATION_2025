// -- IMPORTS

import fs from 'fs/promises';
import path from 'path';

// -- FUNCTIONS

async function clearSession(
    instanceId = '1'
    )
{
    try
    {
        const baseDir = path.resolve( process.env.SESSION_BASE_DIR || './sessions' );
        const sessionDir = path.join( baseDir, instanceId );
        
        console.log( `Clearing session directory: ${sessionDir}` );
        
        // Verifica se o diretório existe
        try
        {
            await fs.access( sessionDir );
        }
        catch ( error )
        {
            console.log( 'Session directory does not exist, nothing to clear.' );
            return;
        }
        
        // Remove o diretório e todo seu conteúdo
        await fs.rm( sessionDir, { recursive: true, force: true } );
        
        console.log( 'Session cleared successfully!' );
    }
    catch ( error )
    {
        console.error( 'Error clearing session:', error );
    }
}

// -- STATEMENTS

// Executa a limpeza se o script for chamado diretamente
if ( import.meta.url === `file://${process.argv[1]}` )
{
    const instanceId = process.argv[2] || '1';
    clearSession( instanceId );
}

export { clearSession }; 