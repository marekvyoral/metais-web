import React from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const EgovHowTo = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs withWidthContainer links={[{ label: t('breadcrumbs.home'), href: '/', icon: HomeIcon }]} />
            <MainContentWrapper>EGOV_HOWTO</MainContentWrapper>
        </>
    )
}

export default EgovHowTo
