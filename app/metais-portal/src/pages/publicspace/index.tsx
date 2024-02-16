import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { formatTitleString } from '@isdd/metais-common/utils/utils'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const ITVSStandards = () => {
    const { t } = useTranslation()
    document.title = formatTitleString(t('publicspace.heading'))
    return (
        <>
            <BreadCrumbs withWidthContainer links={[{ label: t('breadcrumbs.home'), href: '/', icon: HomeIcon }]} />
            <MainContentWrapper>
                <TextHeading size="L">{t('publicspace.heading')}</TextHeading>
            </MainContentWrapper>
        </>
    )
}

export default ITVSStandards
