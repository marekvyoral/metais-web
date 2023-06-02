import type { StorybookConfig } from '@storybook/react-vite'

import tsconfigPaths from 'vite-tsconfig-paths'

const config: StorybookConfig = {
    stories: ['../app/**/*.mdx', '../app/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    viteFinal: async (config, { configType }) => {
        return {
            ...config,
            plugins: [
                ...(config.plugins || []),
                tsconfigPaths({
                    parseNative: false,
                }),
            ],
        }
    },
}
export default config
