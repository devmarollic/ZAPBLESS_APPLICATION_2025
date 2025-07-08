// -- IMPORTS

import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { compile } from 'handlebars';
import { generatePdf } from 'html-pdf-node';

// -- CONSTANTS

const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );

// -- FUNCTIONS

/**
 * Generate a PDF buffer from an HTML template and context.
 * @param {string} templateName - The name of the template file (without .html) in the template directory.
 * @param {object} context - The context object for handlebars template.
 * @returns {Promise<Buffer>} - The generated PDF buffer.
 */
async function generateReportPdf(
    templateName,
    context
    )
{
    let templatePath = resolve( './src/template', `${ templateName }.html` );
    let templateSource = await readFile( templatePath, 'utf8' );
    let compileTemplate = compile( templateSource );
    let htmlBody = compileTemplate( context );

    let file = { content: htmlBody };
    let pdfBuffer = await generatePdf( file, { format: 'A4' } );

    return pdfBuffer;
}

// -- EXPORTS

export const reportAdapter = {
    generateReportPdf
}; 