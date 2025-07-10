// -- IMPORTS

import { messageTemplateCategoryService } from '../service/message_template_category_service';

// -- TYPES

class ListMessageTemplateCategoryUseCase
{
    // -- OPERATIONS

    async execute(
        )
    {
        let MessageTemplateCategoryArray = await messageTemplateCategoryService.getCachedMessageTemplateCategoryArray();

        return MessageTemplateCategoryArray;
    }
}

// -- VARIABLES

export let listMessageTemplateCategoryUseCase = new ListMessageTemplateCategoryUseCase();