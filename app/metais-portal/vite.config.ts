import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
    process.env = {
        ...process.env,
        ...loadEnv(mode, process.cwd()),
    }

    return {
        plugins: [
            react(),
            tsconfigPaths({
                parseNative: false,
            }),
        ],
        server: {
            port: 3000,
            cors: {
                origin: '*',
            },
            proxy: {
                '^/citypes/.*': {
                    target: process.env.VITE_REST_CLIENT_CMDB_BASE_URL,
                    changeOrigin: true,
                    secure: false,
                },
                '^/read/.*': {
                    target: process.env.VITE_REST_CLIENT_TYPES_REPO_BASE_URL,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    }
})
