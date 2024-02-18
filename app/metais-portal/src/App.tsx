import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { useIdentityTerms } from './hooks/useIdentityTerms'

import { Router } from '@/navigation/Router'

export const App: React.FC = () => {
    useIdentityTerms()
    const { t } = useTranslation()
    document.title = `${t('titles.mainPage')} ${META_IS_TITLE}`
    return (
        <Suspense>
            <Router />
        </Suspense>
    )
}
