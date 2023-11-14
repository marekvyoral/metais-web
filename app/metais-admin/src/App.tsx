import React, { Suspense } from 'react'
import { useUserInfo } from '@isdd/metais-common/hooks/useUserInfo'
import { useTranslation } from 'react-i18next'

import { Router } from '@/navigation/Router'

export const App: React.FC = () => {
    useUserInfo()
    const { t } = useTranslation()
    document.title = `${t('titles.mainPage')}`
    return (
        <Suspense>
            <Router />
        </Suspense>
    )
}
