import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tsconfigPaths({
            parseNative: false,
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                quietDeps: true,
            },
        },
    },
    server: {
        port: 3001,
    },
})
