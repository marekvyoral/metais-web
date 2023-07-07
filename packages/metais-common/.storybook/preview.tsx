import React from 'react'
import type { Preview } from '@storybook/react'

import '../src/index.scss'

document.body.classList.add('js-enabled')

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
}

export default preview
