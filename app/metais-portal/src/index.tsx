import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { i18nInstance } from '@isdd/metais-common/localization/i18next'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

import { App } from '@/App'
import { reportWebVitals } from '@/reportWebVitals'
import '@/index.scss'
import { AuthContextProvider } from '@/contexts/auth/authContext'

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
            <QueryClientProvider client={queryClient}>
                <I18nextProvider i18n={i18nInstance}>
                    <AuthContextProvider>
                        <DndProvider backend={HTML5Backend}>
                            <App />
                        </DndProvider>
                    </AuthContextProvider>
                </I18nextProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
