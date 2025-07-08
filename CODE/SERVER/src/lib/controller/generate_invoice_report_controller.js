// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { reportAdapter } from '../adapter/report_adapter.js';
import { mailer } from '../../mailer.js';

// -- TYPES

export class GenerateInvoiceReportController
{
    // -- OPERATIONS

    async handle(
        request,
        response
        )
    {
        try
        {
            let {
                to,
                subject,
                context
            } = request.body;

            // Generate PDF buffer from template and context
            let pdfBuffer = await reportAdapter.generateReportPdf('subscription', context);

            // Send email with PDF attachment
            await mailer.sendEmail(
                to,
                subject || 'Fatura de Assinatura',
                'subscription',
                context,
                [
                    {
                        filename: 'fatura.pdf',
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]
            );

            response.status(StatusCodes.OK).send({ success: true, message: 'Fatura enviada por email com sucesso.' });
        }
        catch (error)
        {
            response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: error.message || 'Erro ao enviar fatura por email',
                error: error.code || 'UNKNOWN_ERROR'
            });
        }
    }
} 