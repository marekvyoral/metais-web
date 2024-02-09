import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { formatTitleString } from '@isdd/metais-common/utils/utils'

import { MainContentWrapper } from '@/components/MainContentWrapper'
import { SlaDetailContainer } from '@/components/containers/sla-detail/SLADetailContainer'
import { SlaDetailView } from '@/components/views/sla-detail/SLADetailView'

const SLADetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { entityName, paramType, serviceId, slaId } = useParams()
    document.title = formatTitleString(t('sla-detail.slaDetail'))
    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('sla-params-list.slaList') ?? '', href: `/sla-params-list/${entityName}` },
                    { label: t('sla-detail.slaDetail') ?? '', href: `/sla-detail/${entityName}/${paramType}/${serviceId}/${slaId}` },
                ]}
            />
            <SlaDetailContainer
                entityName={entityName ?? ''}
                paramType={paramType ?? ''}
                serviceId={serviceId ?? ''}
                slaId={slaId ?? ''}
                View={(props) => {
                    return (
                        <MainContentWrapper>
                            <SlaDetailView {...props} />
                        </MainContentWrapper>
                    )
                }}
            />
        </>
    )
}

export default SLADetailPage
