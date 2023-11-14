import React from 'react'
import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const PUBLIC_AUTHORITIES_HOWTO = () => {
    const { t } = useTranslation()

    return (
        <>
            <BreadCrumbs withWidthContainer links={[{ label: t('breadcrumbs.home'), href: '/', icon: HomeIcon }]} />
            <MainContentWrapper>
                <TextHeading size="L">{t('howto.publicAuthorities')}</TextHeading>
                PUBLIC_AUTHORITIES_HOWTO
            </MainContentWrapper>
        </>
    )
}

export default PUBLIC_AUTHORITIES_HOWTO
