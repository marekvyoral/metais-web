import React from 'react'
import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useTranslation } from 'react-i18next'

import HowToContent from './howto/howToContent'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { SummaryEntitiesCounts } from '@/components/summary-entities-count/SummaryEntitiesCount'
import { LatestModifiedCiEntities } from '@/components/latest-modified-ci-entities/LatestModifiedCiEntities'
export const Home: React.FC = () => {
    const { t } = useTranslation()
    return (
        <>
            <BreadCrumbs withWidthContainer links={[{ label: t('breadcrumbs.home'), href: '/', icon: HomeIcon }]} />
            <MainContentWrapper>
                <SummaryEntitiesCounts />
                <LatestModifiedCiEntities />
                <HowToContent howToEnumType="DASHBOARD" />
            </MainContentWrapper>
        </>
    )
}
