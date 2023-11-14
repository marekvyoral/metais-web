import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import { Router } from './navigation/Router'

export const App: React.FC = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.login')} | MetaIS`

    return (
        <Suspense>
            <Router />
        </Suspense>
    )
}
