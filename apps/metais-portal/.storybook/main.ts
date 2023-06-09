import * as path from 'path'

import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    viteFinal: async (config, { configType }) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@portal/': `${path.join(__dirname, '../src')}/`,
            '@metais-web/idsk-ui-kit': `${path.join(__dirname, '../../../packages/idsk-ui-kit/src')}/index.ts`,
            '@metais-web/metais-common': `${path.join(__dirname, '../../../packages/idsk-ui-kit/src')}/index.ts`,
        }

        return config
    },
}
export default config
