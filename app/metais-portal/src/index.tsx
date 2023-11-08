import { ActionSuccessProvider } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { FilterContextProvider } from '@isdd/metais-common/contexts/filter/filterContext'
import { NewRelationDataProvider } from '@isdd/metais-common/contexts/new-relation/newRelationContext'
import { UserPreferencesProvider } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { initializeI18nInstance } from '@isdd/metais-common/localization/i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from '@isdd/metais-common/contexts/auth/authContext'
import { AuthProvider, TAuthConfig } from 'react-oauth2-code-pkce'

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
            refetchOnWindowFocus: false,
        },
    },
})

const baseUrl =
    import.meta.env.VITE_REST_CLIENT_IAM_OIDC_BASE_URL + (import.meta.env.VITE_IAM_OIDC_PATH ? `/${import.meta.env.VITE_IAM_OIDC_PATH}` : '')

const authConfig: TAuthConfig = {
    clientId: 'webPortalClient',
    extraAuthParameters: { response_type: 'code' },
    authorizationEndpoint: baseUrl + '/authorize',
    tokenEndpoint: baseUrl + '/token',
    redirectUri: window.location.protocol + '//' + window.location.host,
    scope: 'openid profile c_ui',
    autoLogin: false,
}

root.render(
    <React.StrictMode>
        <NewRelationDataProvider>
            <BrowserRouter>
                <I18nextProvider i18n={initializeI18nInstance()}>
                    <QueryClientProvider client={queryClient}>
                        <AuthProvider authConfig={authConfig}>
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
                        </AuthProvider>
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
