import { createInstance } from 'i18next'
import Backend from 'i18next-http-backend'
import { DateTime } from 'luxon'
import { initReactI18next } from 'react-i18next'

import { Languages } from './languages'

import { GetAllUserInterface } from '@isdd/metais-common/api/generated/globalConfig-manager-swagger'

export const LANGUAGE_STORE_KEY = 'i18nLang'

type InitializeI18NProps = {
    basePath: string
    userInterface: GetAllUserInterface
}

export const initializeI18nInstance = ({ basePath, userInterface }: InitializeI18NProps) => {
    const i18nInstance = createInstance()
    const FALLBACK_LNG = localStorage.getItem(LANGUAGE_STORE_KEY) || Languages.SLOVAK

    const isDev = import.meta.env.VITE_ENVIRONMENT === 'DEV'

    i18nInstance
        .use(Backend)
        .use(initReactI18next)
        .init({
            backend: {
                loadPath: (lng: string[]) => {
                    if (isDev) {
                        return '/translations/{{lng}}.json'
                    } else {
                        const UPPER_CASE_LNG = lng[0].toUpperCase()
                        const GET_ALL_URL = '/global-config/textConf/getAll'
                        return basePath + GET_ALL_URL + `?locale=${UPPER_CASE_LNG}&userInterface=${userInterface}`
                    }
                },
            },
            fallbackLng: FALLBACK_LNG,
            debug: true,
            keySeparator: '.',
            ns: ['translations'],
            interpolation: {
                escapeValue: false,
                formatSeparator: ',',
            },
            react: {
                useSuspense: true,
            },
            returnNull: false,
        })

    i18nInstance.services.formatter?.add('DATE_SHORT', (value, lng) => {
        try {
            if (!lng) return value
            if (value && DateTime.fromJSDate(new Date(value)).isValid) {
                return DateTime.fromJSDate(new Date(value)).setLocale(lng).toLocaleString(DateTime.DATE_SHORT)
            }
            return ''
        } catch {
            return value
        }
    })

    i18nInstance.services.formatter?.add('DATETIME_SHORT_WITH_SECONDS', (value, lng) => {
        try {
            if (!lng) return value
            if (value && DateTime.fromJSDate(new Date(value)).isValid) {
                return DateTime.fromJSDate(new Date(value)).setLocale(lng).toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS)
            }
            return ''
        } catch {
            return value
        }
    })

    return i18nInstance
}
