// -- IMPORTS

import { StatusCodes } from 'http-status-codes';
import { listMessageTemplateCategoryUseCase } from '../use_case/list_message_template_category_use_case';

// -- TYPES

export class ListMessageTemplateCategoryController
{
    // -- OPERATIONS

    async handle(
        request,
        response
        )
    {
        let messageTemplateCategoryArray = await listMessageTemplateCategoryUseCase.execute();

        return messageTemplateCategoryArray;
    }
}