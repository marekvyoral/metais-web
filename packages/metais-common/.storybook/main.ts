import type { StorybookConfig } from '@storybook/react-vite'
const tsconfigPaths = require('vite-tsconfig-paths')

const config: StorybookConfig = {
    stories: ['../**/*.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    async viteFinal(config) {
        return {
            ...config,
            plugins: [...(config?.plugins ?? []), tsconfigPaths.default()],
        }
    },
}
export default config
