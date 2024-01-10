import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { SlaParamsListContainer } from '@/components/containers/sla-params-list/SlaParamsListContainer'
import { SlaParamsListView } from '@/components/views/sla-params-list/SlaParamsListView'

export interface ReportsFilterData extends IFilterParams {
    name?: string
    category?: string
}

const SLAParamsListPage: React.FC = () => {
    const { t } = useTranslation()
    const { entityName } = useParams()
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('sla-params-list.slaList') ?? '', href: `/sla-params-list/${entityName}` },
                ]}
            />
            <SlaParamsListContainer
                entityName={entityName ?? ''}
                View={(props) => {
                    return (
                        <MainContentWrapper>
                            <SlaParamsListView {...props} />
                        </MainContentWrapper>
                    )
                }}
            />
        </>
    )
}

export default SLAParamsListPage
