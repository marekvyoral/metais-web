import React from 'react'
import { useTranslation } from 'react-i18next'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const LicenseHowTo = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs withWidthContainer links={[{ label: t('breadcrumbs.home'), href: '/', icon: HomeIcon }]} />
            <MainContentWrapper>{t('navMenu.lists.licenses')}</MainContentWrapper>
        </>
    )
}

export default LicenseHowTo
