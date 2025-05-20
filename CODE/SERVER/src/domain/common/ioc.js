// -- CONTANTS

export const domain =
{
    usecases:
    {
        church:
            {
                create: Symbol.for( 'CreateChurchUseCase' ),
                get: Symbol.for( 'GetChurchUsecase' ),
                list: Symbol.for( 'ListChurchUsecase' ),
                update: Symbol.for( 'UpdateChurchUsecase' ),    
                delete: Symbol.for( 'DeleteChurchUsecase' )
            }
    }
};