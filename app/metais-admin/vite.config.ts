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
                // '^/metaisiam/.*': {
                //     target: process.env.VITE_REST_CLIENT_IAM_OIDC_BASE_URL,
                //     changeOrigin: true,
                //     secure: false,
                //     rewrite: (p) => p.replace(/^\/metaisiam/, ''),
                // },
            },
        },
    }
})
