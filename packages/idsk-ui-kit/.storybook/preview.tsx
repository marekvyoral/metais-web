import React from 'react'
import type { Preview } from '@storybook/react'

import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { BrowserRouter as Router } from 'react-router-dom'

import '../src/index.scss'
import { I18nextProvider } from 'react-i18next'
import { i18nInstance } from '../localization/i18next'

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
            <Router>
                <I18nextProvider i18n={i18nInstance}>
                    <DndProvider backend={HTML5Backend}>
                        <StoryComponent />
                    </DndProvider>
                </I18nextProvider>
            </Router>
        ),
    ],
}

export default preview
