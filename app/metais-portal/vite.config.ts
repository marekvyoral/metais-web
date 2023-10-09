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
        css: {
            preprocessorOptions: {
                scss: {
                    // quietDeps: true,
                },
            },
        },
        server: {
            port: 3000,
            cors: {
                origin: '*',
            },
            proxy: {
                '^/standards/.*': {
                    target: process.env.VITE_REST_CLIENT_STANDARDS_TARGET_URL,
                    changeOrigin: true,
                    secure: false,
                },
                '^/groups': {
                    target: process.env.VITE_REST_ADMIN_IAM_TARGET_URL,
                    changeOrigin: true,
                    secure: false,
                },
                '^/groups/.*': {
                    target: process.env.VITE_REST_ADMIN_IAM_TARGET_URL,
                    changeOrigin: true,
                    secure: false,
                },
                '^/identities/.*': {
                    target: process.env.VITE_REST_ADMIN_IAM_TARGET_URL,
                    changeOrigin: true,
                    secure: false,
                },
                '^/identities': {
                    target: process.env.VITE_REST_ADMIN_IAM_TARGET_URL,
                    changeOrigin: true,
                    secure: false,
                },
                '^/file/.*': {
                    target: process.env.VITE_REST_CLIENT_DMS_TARGET_URL,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    }
})
