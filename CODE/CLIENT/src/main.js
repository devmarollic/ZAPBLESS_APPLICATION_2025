// -- IMPORTS

import './app.styl';
import App from './App.svelte';

// -- STATEMENTS

export default app =
    new App(
        {
            target: document.getElementById( 'app' )
        }
        );
