import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// -- TYPES

declare global {
    interface Array<T> {
        findIndexByKey(key: string | number, value: string | number): number;
        findIndexById(id: string | number): number;
    }
}

Array.prototype.findIndexByKey = function(
    key: string | number,
    value: string | number
    ): number
{
    for (let index = 0; index < this.length; index++)
    {
        let currentItem = this[ index ];

        if ( currentItem[ key ] === value )
        {
            return index;
        }
    }

    return -1;
}

Array.prototype.findIndexById = function(
    id: string | number
    ): number
{
    for (let index = 0; index < this.length; index++)
    {
        let currentItem = this[ index ];

        if ( currentItem.id === id )
        {
            return index;
        }
    }

    return -1;
}

createRoot(document.getElementById("root")!).render(<App />);
