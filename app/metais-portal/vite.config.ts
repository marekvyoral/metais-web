import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default ({ mode }) => {
    process.env = {
        ...process.env,
        ...loadEnv(mode, process.cwd()),
    }
    // https://vitejs.dev/config/
    return defineConfig({
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
                    target: 'http://types-repo-metais3.apps.dev.isdd.sk',
                    changeOrigin: true,
                    secure: false,
                },
                '^/read/.*': {
                    target: 'https://metais.vicepremier.gov.sk/cmdb',
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
    })
}
