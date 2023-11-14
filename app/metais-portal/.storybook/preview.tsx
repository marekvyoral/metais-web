import React from 'react'
import type { Preview } from '@storybook/react'

import '../src/index.scss'
import { I18nextProvider } from 'react-i18next'
import { i18nInstance } from '@isdd/idsk-ui-kit/localization/i18next'

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
    decorators: [
        (StoryComponent) => (
            <I18nextProvider i18n={i18nInstance}>
                <StoryComponent />
            </I18nextProvider>
        ),
    ],
}

export default preview
