import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { useIdentityTerms } from './hooks/useIdentityTerms'

import { Router } from '@/navigation/Router'

export const App: React.FC = () => {
    useIdentityTerms()
    const { t } = useTranslation()
    document.title = `${t('titles.mainPage')} | MetaIS`
    return (
        <Suspense>
            <Router />
        </Suspense>
    )
}
