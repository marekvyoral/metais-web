/// <reference types="vitest" />
import path from 'path'

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import alias from '@rollup/plugin-alias'

const projectRootDir = path.resolve(__dirname)
export default defineConfig({
    cacheDir: '../../node_modules/.vite/metais-admin',

    server: {
        port: 3001,
        host: 'localhost',
    },

    preview: {
        port: 4300,
        host: 'localhost',
    },

    plugins: [
        react(),
        alias({
            entries: [
                {
                    find: '@',
                    replacement: `${path.resolve(projectRootDir, 'src')}/`,
                },
            ],
        }),
        viteTsConfigPaths({
            root: '../../',
        }),
    ],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [
    //    viteTsConfigPaths({
    //      root: '../../',
    //    }),
    //  ],
    // },

    test: {
        globals: true,
        cache: {
            dir: '../../node_modules/.vitest',
        },
        environment: 'jsdom',
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
})
