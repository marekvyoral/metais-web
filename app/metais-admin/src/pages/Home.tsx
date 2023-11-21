import React from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { MainContentWrapper } from '@/components/MainContentWrapper'

export const Home: React.FC = () => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user
    return (
        <>
            <BreadCrumbs withWidthContainer links={[{ label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon }]} />
            <MainContentWrapper>{isUserLogged ? t('homePage.loggedInPlaceholder') : t('homePage.placeholder')}</MainContentWrapper>
        </>
    )
}
