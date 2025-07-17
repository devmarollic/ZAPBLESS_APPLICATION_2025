// -- TYPES

export class Repository
{
    insert(
        table,
        data
        )
    {
        throw new Error( 'Not implemented' );
    }

    upsert(
        table,
        data
        )
    {
        throw new Error( 'Not implemented' );
    }

    update(
        table,
        idCol,
        id,
        data
        )
    {
        throw new Error( 'Not implemented' );
    }

    remove(
        table,
        filters
        )
    {
        throw new Error( 'Not implemented' );
    }

    query(
        table,
        filters,
        options = { limit: 10, order: 'asc' }
        )
    {
        throw new Error( 'Not implemented' );
    }
}