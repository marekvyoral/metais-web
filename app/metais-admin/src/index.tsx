import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { initializeI18nInstance } from '@isdd/metais-common/localization/i18next'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { AuthContextProvider } from '@isdd/metais-common/contexts/auth/authContext'
import { FilterContextProvider } from '@isdd/metais-common/contexts/filter/filterContext'
import { ActionSuccessProvider } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { UserPreferencesProvider } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'

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

const basename = import.meta.env.VITE_ADMIN_URL

root.render(
    <React.StrictMode>
        <BrowserRouter basename={basename}>
            <I18nextProvider i18n={initializeI18nInstance(basename)}>
                <QueryClientProvider client={queryClient}>
                    <AuthContextProvider>
                        <FilterContextProvider>
                            <ActionSuccessProvider>
                                <UserPreferencesProvider>
                                    <DndProvider backend={HTML5Backend}>
                                        <App />
                                    </DndProvider>
                                </UserPreferencesProvider>
                            </ActionSuccessProvider>
                        </FilterContextProvider>
                    </AuthContextProvider>
                </QueryClientProvider>
            </I18nextProvider>
        </BrowserRouter>
    </React.StrictMode>,
)

reportWebVitals()
