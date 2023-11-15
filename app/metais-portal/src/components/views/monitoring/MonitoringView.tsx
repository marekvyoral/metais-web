import React from 'react'
import { BreadCrumbs } from '@isdd/idsk-ui-kit/bread-crumbs/BreadCrumbs'
import { HomeIcon } from '@isdd/idsk-ui-kit/assets/images'
import { MONITORING } from '@isdd/metais-common/constants'
import { useTranslation } from 'react-i18next'

import { MonitoringViewProps } from '@/components/containers/MonitoringContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export const MonitoringView: React.FC<MonitoringViewProps> = ({ data }) => {
    const { t } = useTranslation()

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('monitoring.heading') ?? '', href: `/${MONITORING}` },
                ]}
            />
            <MainContentWrapper>
                <h1>Monitoring</h1>
                <h2>{data.text}</h2>
            </MainContentWrapper>
        </>
    )
}

export default MonitoringView
