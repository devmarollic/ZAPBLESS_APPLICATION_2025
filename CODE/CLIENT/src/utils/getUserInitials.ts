export const getUserInitials = (name: string) => {
    if ( name === null || name === undefined ) {
        return '';
    }

    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};