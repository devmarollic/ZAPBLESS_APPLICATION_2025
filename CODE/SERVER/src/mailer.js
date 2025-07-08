// -- IMPORTS

import { createTransport } from 'nodemailer';
import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { compile } from 'handlebars';
import { logError } from 'senselogic-gist';

// -- VARIABLES

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const transporter = createTransport(
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
 * @param {Array}           attachments Optional array of attachment objects for nodemailer
 */
async function sendEmail( to, subject, template, context = {}, attachments = [] )
{
    try
    {
        let templatePath = resolve(__dirname, '..', 'template', `${template}.html`);
        let templateSource = await readFile(templatePath, 'utf8');
        let compileTemplate = compile(templateSource);
        let htmlBody = compileTemplate(context);

        let mailOptions =
            {
                from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
                to,
                subject,
                html: htmlBody,
                attachments
            };

        await transporter.sendMail(mailOptions);
    }
    catch (error)
    {
        logError('[Mailer] Failed to send email:', error);
        throw error;
    }
}

// -- EXPORTS

export const mailer = {
    sendEmail
};