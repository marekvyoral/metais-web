import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { i18nInstance } from '@isdd/metais-common/localization/i18next'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

import { App } from '@/App'
import { reportWebVitals } from '@/reportWebVitals'
import './index.scss'

document.body.classList.add('js-enabled')
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
            <I18nextProvider i18n={i18nInstance}>
                <QueryClientProvider client={queryClient}>
                    <DndProvider backend={HTML5Backend}>
                        <App />
                    </DndProvider>
                </QueryClientProvider>
            </I18nextProvider>
        </BrowserRouter>
    </React.StrictMode>,
)

reportWebVitals()
