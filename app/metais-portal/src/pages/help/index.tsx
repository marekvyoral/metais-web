import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const TutorialPage = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs withWidthContainer links={[{ label: t('breadcrumbs.home'), href: '/', icon: HomeIcon }]} />
            <MainContentWrapper>
                <TextHeading size="L">{t('howto.guides')}</TextHeading>
            </MainContentWrapper>
        </>
    )
}

export default TutorialPage
