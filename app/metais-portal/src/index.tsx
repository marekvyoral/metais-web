import { AuthContextProvider } from '@isdd/metais-common/contexts/auth/authContext'
import { FilterContextProvider } from '@isdd/metais-common/contexts/filter/filterContext'
import { NewRelationDataProvider } from '@isdd/metais-common/contexts/new-relation/newRelationContext'
import { i18nInstance } from '@isdd/metais-common/localization/i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { ActionSuccessProvider } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { UserPreferencesProvider } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'

import { App } from '@/App'
import '@/index.scss'
import { reportWebVitals } from '@/reportWebVitals'

document.body.classList.add('js-enabled')

const root = createRoot(document.getElementById('root') as HTMLElement)
const CACHE_TIME = import.meta.env.VITE_CACHE_TIME
const STALE_TIME = import.meta.env.VITE_CACHE_TIME
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            enabled: true,
            keepPreviousData: true,
            staleTime: CACHE_TIME,
            cacheTime: STALE_TIME,
        },
    },
})

root.render(
    <React.StrictMode>
        <NewRelationDataProvider>
            <BrowserRouter>
                <I18nextProvider i18n={i18nInstance}>
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
        </NewRelationDataProvider>
    </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
