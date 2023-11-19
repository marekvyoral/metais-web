import React from 'react'
import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'

import { MainContentWrapper } from '@/components/MainContentWrapper'

const GeneralHowTo = () => {
    const { t } = useTranslation()

    return (
        <>
            <BreadCrumbs withWidthContainer links={[{ label: t('breadcrumbs.home'), href: '/', icon: HomeIcon }]} />
            <MainContentWrapper>
                <TextHeading size="L">GENERAL HOW TO PAGE</TextHeading>
                GENERAL HOW TO PAGE
            </MainContentWrapper>
        </>
    )
}

export default GeneralHowTo
