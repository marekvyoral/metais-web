import path from 'path'

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
    process.env = {
        ...process.env,
        ...loadEnv(mode, process.cwd()),
    }

    return {
        build: {
            lib: {
                entry: path.resolve(__dirname, 'src/api/hooks/transform/attributesTypesTransformer.ts'),
                fileName: () => 'metais-web.js',
                formats: ['es'],
            },
        },
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
            port: 3000,
            cors: {
                origin: '*',
            },
            proxy: {
                '^/read/.*': {
                    target: process.env.VITE_REST_CLIENT_CMDB_TARGET_URL,
                    changeOrigin: true,
                    secure: false,
                },
                '^/citypes/.*': {
                    target: process.env.VITE_REST_CLIENT_TYPES_REPO_TARGET_URL,
                    changeOrigin: true,
                    secure: false,
                },
                '^/enums/.*': {
                    target: process.env.VITE_REST_CLIENT_ENUMS_REPO_TARGET_URL,
                    changeOrigin: true,
                    secure: false,
                },
                '^/columns/.*': {
                    target: process.env.VITE_REST_CLIENT_USER_CONFIG_TARGET_URL,
                    changeOrigin: true,
                    secure: false,
                },
                '^/metaisiam/.*': {
                    target: process.env.VITE_REST_CLIENT_IAM_OIDC_BASE_URL,
                    changeOrigin: true,
                    secure: false,
                    rewrite: (p) => p.replace(/^\/metaisiam/, ''),
                },
            },
        },
    }
})
