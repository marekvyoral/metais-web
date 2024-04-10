import { ActionSuccessProvider } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { authConfig } from '@isdd/metais-common/contexts/auth/authConfig'
import { AuthContextProvider } from '@isdd/metais-common/contexts/auth/authContext'
import { CodeListWorkingLanguageProvider } from '@isdd/metais-common/contexts/codeListWorkingLanguage/codeListWorkingLanguageContext'
import { FilterContextProvider } from '@isdd/metais-common/contexts/filter/filterContext'
import { UserPreferencesProvider } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { initializeI18nInstance } from '@isdd/metais-common/localization/i18next'
import { AutoLogout } from '@isdd/metais-common/src/components/auto-logout/AutoLogout'
import { CrashFallback } from '@isdd/metais-common/src/components/crash-fallback/CrashFallback'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { I18nextProvider } from 'react-i18next'
import { AuthProvider } from 'react-oauth2-code-pkce'
import { BrowserRouter } from 'react-router-dom'

import { App } from '@/App'
import '@/index.scss'
import { reportWebVitals } from '@/reportWebVitals'

document.body.classList.add('js-enabled')

const root = createRoot(document.getElementById('root') as HTMLElement)
const CACHE_TIME = import.meta.env.VITE_CACHE_TIME
const STALE_TIME = import.meta.env.VITE_CACHE_TIME

const CLIENT_ID = import.meta.env.VITE_PORTAL_AUTH_CLIENT_ID
const SCOPE = import.meta.env.VITE_PORTAL_AUTH_SCOPE

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

const BASEPATH = import.meta.env.VITE_API_BASE_URL

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <I18nextProvider i18n={initializeI18nInstance({ basePath: BASEPATH, userInterface: 'PORTAL' })}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider authConfig={authConfig({ clientId: CLIENT_ID, scope: SCOPE })}>
                        <AuthContextProvider>
                            <ErrorBoundary fallbackRender={({ error }) => <CrashFallback error={error} />}>
                                <AutoLogout>
                                    <FilterContextProvider>
                                        <ActionSuccessProvider>
                                            <UserPreferencesProvider>
                                                <CodeListWorkingLanguageProvider>
                                                    <DndProvider backend={HTML5Backend}>
                                                        <App />
                                                    </DndProvider>
                                                </CodeListWorkingLanguageProvider>
                                            </UserPreferencesProvider>
                                        </ActionSuccessProvider>
                                    </FilterContextProvider>
                                </AutoLogout>
                            </ErrorBoundary>
                        </AuthContextProvider>
                    </AuthProvider>
                </QueryClientProvider>
            </I18nextProvider>
        </BrowserRouter>
    </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
