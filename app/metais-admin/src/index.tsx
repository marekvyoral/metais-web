import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { initializeI18nInstance } from '@isdd/metais-common/localization/i18next'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import { AuthContextProvider } from '@isdd/metais-common/contexts/auth/authContext'
import { authConfig } from '@isdd/metais-common/contexts/auth/authConfig'
import { FilterContextProvider } from '@isdd/metais-common/contexts/filter/filterContext'
import { ActionSuccessProvider } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { UserPreferencesProvider } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { AuthProvider } from 'react-oauth2-code-pkce'
import { AutoLogout } from '@isdd/metais-common/src/components/auto-logout/AutoLogout'

import { App } from '@/App'
import { reportWebVitals } from '@/reportWebVitals'

import './index.scss'

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
            refetchOnWindowFocus: false,
        },
    },
})

const BASENAME = import.meta.env.VITE_ADMIN_URL
const CLIENT_ID = import.meta.env.VITE_ADMIN_AUTH_CLIENT_ID
const SCOPE = import.meta.env.VITE_ADMIN_AUTH_SCOPE

root.render(
    <React.StrictMode>
        <BrowserRouter basename={BASENAME}>
            <I18nextProvider i18n={initializeI18nInstance(BASENAME)}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider authConfig={authConfig({ clientId: CLIENT_ID, redirectUri: BASENAME + '/', scope: SCOPE })}>
                        <AuthContextProvider>
                            <AutoLogout>
                                <FilterContextProvider>
                                    <ActionSuccessProvider>
                                        <UserPreferencesProvider>
                                            <DndProvider backend={HTML5Backend}>
                                                <App />
                                            </DndProvider>
                                        </UserPreferencesProvider>
                                    </ActionSuccessProvider>
                                </FilterContextProvider>
                            </AutoLogout>
                        </AuthContextProvider>
                    </AuthProvider>
                </QueryClientProvider>
            </I18nextProvider>
        </BrowserRouter>
    </React.StrictMode>,
)

reportWebVitals()
