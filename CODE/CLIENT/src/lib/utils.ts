import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getMap(
    elementArray,
    keyName = 'id',
    default_value = null
) {
    if (elementArray) {
        const elementMap = {};

        for (const element of elementArray) {
            elementMap[element[keyName]] = element;
        }

        return elementMap;
    }
    else {
        return default_value;
    }
}
