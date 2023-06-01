import { defineConfig } from 'vite'https://tanstack.com/table/v8/docs/examples/react/pagination
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
    server: {
        port: 3001,
    },
})
