// -- IMPORTS

import { defineConfig } from 'vitest/config';
import path from 'path';

// -- STATEMENTS

export default defineConfig(
    {
        test: {
            globals: true,
            environment: 'node',
            setupFiles: './src/tests/setup.js',
            coverage: {
                provider: 'v8',
                reporter: ['text', 'json', 'html'],
                exclude: [
                    'node_modules/',
                    'src/tests/',
                    '**/*.d.ts',
                    '**/*.config.*',
                    '**/coverage/**'
                ]
            },
            testMatch: [
                '**/src/tests/**/*.test.js'
            ],
            watchExclude: [
                'node_modules/**',
                'dist/**'
            ]
        },
        resolve: {
            alias: {
                '@': path.resolve( __dirname, './src' ),
                '@config': path.resolve( __dirname, './src/config' ),
                '@modules': path.resolve( __dirname, './src/modules' ),
                '@shared': path.resolve( __dirname, './src/shared' ),
                '@utils': path.resolve( __dirname, './src/utils' )
            }
        }
    }
); 