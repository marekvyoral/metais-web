import { createInstance } from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

export const i18nInstance = createInstance()

i18nInstance
    .use(Backend)
    .use(initReactI18next)
    .init({
        backend: {
            loadPath: '/translations/{{lng}}.json',
        },
        fallbackLng: 'sk',
        debug: true,
        keySeparator: '.',
        ns: ['translations'],
        interpolation: {
            escapeValue: false,
            formatSeparator: ',',
        },
        react: {
            useSuspense: false,
        },
        returnNull: false,
    })
