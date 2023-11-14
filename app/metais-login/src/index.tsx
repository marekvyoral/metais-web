import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { initializeI18nInstance } from '@isdd/metais-common/localization/i18next'

import { App } from './App'

import './index.scss'

document.body.classList.add('js-enabled')

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <I18nextProvider i18n={initializeI18nInstance()}>
                <App />
            </I18nextProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
