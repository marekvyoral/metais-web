import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { i18nInstance } from '@isdd/metais-common/localization/i18next'

import { App } from '@/App'
import { reportWebVitals } from '@/reportWebVitals'

import '@/index.scss'

document.body.classList.add('js-enabled')
const root = createRoot(document.getElementById('root') as HTMLElement)
const queryClient = new QueryClient()

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <I18nextProvider i18n={i18nInstance}>
                    <App />
                </I18nextProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
