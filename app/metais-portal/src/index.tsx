import { ActionSuccessProvider } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { FilterContextProvider } from '@isdd/metais-common/contexts/filter/filterContext'
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
import { AuthProvider } from 'react-oauth2-code-pkce'
import { AutoLogout } from '@isdd/metais-common/src/components/auto-logout/AutoLogout'
import { authConfig } from '@isdd/metais-common/contexts/auth/authConfig'
import { CrashFallback } from '@isdd/metais-common/src/components/crash-fallback/CrashFallback'
import { CodeListWorkingLanguageProvider } from '@isdd/metais-common/contexts/codeListWorkingLanguage/codeListWorkingLanguageContext'
import { ErrorBoundary } from 'react-error-boundary'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

import { App } from '@/App'
import '@/index.scss'
import { reportWebVitals } from '@/reportWebVitals'

document.body.classList.add('js-enabled')

const root = createRoot(document.getElementById('root') as HTMLElement)
const CACHE_TIME = import.meta.env.VITE_CACHE_TIME
const STALE_TIME = import.meta.env.VITE_CACHE_TIME

const CLIENT_ID = import.meta.env.VITE_PORTAL_AUTH_CLIENT_ID
const SCOPE = import.meta.env.VITE_PORTAL_AUTH_SCOPE
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY
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

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <I18nextProvider i18n={initializeI18nInstance()}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider authConfig={authConfig({ clientId: CLIENT_ID, scope: SCOPE })}>
                        <AuthContextProvider>
                            <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
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
                            </GoogleReCaptchaProvider>
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
