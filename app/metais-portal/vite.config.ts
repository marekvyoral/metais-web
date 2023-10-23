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
            sourcemap: true,
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
                    // quietDeps: true,
                },
            },
        },
        server: {
            port: 3000,
            cors: {
                origin: '*',
            },
        },
    }
})
