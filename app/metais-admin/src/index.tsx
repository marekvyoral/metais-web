import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { i18nInstance } from '@isdd/metais-common/localization/i18next'

import { App } from '@/App'
import { reportWebVitals } from '@/reportWebVitals'
import './index.scss'

const root = createRoot(document.getElementById('root') as HTMLElement)
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

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

reportWebVitals()
