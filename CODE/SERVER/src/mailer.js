// -- IMPORTS

import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import handlebars from 'handlebars';
import { logError } from 'senselogic-gist';

// -- VARIABLES

const transporter = nodemailer.createTransport(
    {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:
            {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
    }
    );

// -- OPERATIONS -------------------------------------------------------------

/**
 * Send an e-mail using an .html template located in src/template.
 * @param {string|string[]} to          Recipient address(es)
 * @param {string}          subject     Subject line
 * @param {string}          template    File name (without .html) found in template folder
 * @param {object}          context     Key-value pairs used by Handlebars
 */
async function sendEmail( to, subject, template, context = {} )
{
    try
    {
        let templatePath = path.resolve( process.cwd(), 'src', 'template', `${ template }.html` );
        let templateSource = await fs.readFile( templatePath, 'utf8' );
        let compileTemplate = handlebars.compile( templateSource );
        let htmlBody = compileTemplate( context );

        let mailOptions =
            {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to,
                subject,
                html: htmlBody
            };

        await transporter.sendMail( mailOptions );
    }
    catch ( error )
    {
        logError( '[Mailer] Failed to send email:', error );

        throw error;
    }
}

// -- EXPORTS

export let mailer =
    {
        sendEmail
    };