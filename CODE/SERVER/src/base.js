// -- FUNCTIONS

export function isNullOrUndefined(
    value
    )
{
    return value === null || value === undefined;
}

// ~~

export function applyPagination(
    page,
    limit
    )
{
    let startIndex = ( page - 1 ) * limit;
    let endIndex = startIndex + limit;

    return (
        {
            startIndex,
            endIndex
        }
        );
}