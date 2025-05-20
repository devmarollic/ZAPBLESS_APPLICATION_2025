import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig(
    {
        plugins: [ svelte() ],
        resolve:
        {
            alias:
            {
                $src: resolve( __dirname, 'src/' ),
                $lib: resolve( __dirname, 'src/lib' ),
                $component: resolve( __dirname, 'src/lib/component' ),
                $store: resolve( __dirname, 'src/lib/store' ),
            }
        },
        build: {
            sourcemap: true
        },
        server: {
            sourcemap: true
        },
        base: '/admin/'
    }
    );
