import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const RefRegistersRequests = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs withWidthContainer links={[{ label: t('breadcrumbs.home'), href: '/', icon: HomeIcon }]} />
            <MainContentWrapper>
                <TextHeading size="L">{t('refRegisters.requests.heading')}</TextHeading>
            </MainContentWrapper>
        </>
    )
}

export default RefRegistersRequests
