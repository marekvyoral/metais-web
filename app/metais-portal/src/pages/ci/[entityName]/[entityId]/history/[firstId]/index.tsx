import React from 'react'
import { useParams } from 'react-router-dom'
import { BreadCrumbs } from '@isdd/idsk-ui-kit/bread-crumbs/BreadCrumbs'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useTranslation } from 'react-i18next'

import { CiHistoryPermissionsWrapper } from '@/components/permissions/CiHistoryPermissionsWrapper'
import { HistoryCompareView } from '@/components/views/history/history-compare/HistoryCompareView'
import { HistorySingleItemCompareContainer } from '@/components/containers/HistorySingleItemCompareContainer'

const CompareSinglePage: React.FC = () => {
    const { t } = useTranslation()
    const { firstId, entityId, entityName } = useParams()
    const { data: ciItemData } = useReadConfigurationItem(entityId ?? '', {
        query: {
            queryKey: ['ciItemData', entityId],
        },
    })

    return (
        <CiHistoryPermissionsWrapper entityId={entityId ?? ''} entityName={entityName ?? ''}>
            <>
                <BreadCrumbs
                    links={[
                        { label: t('breadcrumbs.home'), href: '/' },
                        { label: entityName, href: `/ci/${entityName}` },
                        {
                            label: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                            href: `/ci/${entityName}/${entityId}`,
                        },
                        { label: t('breadcrumbs.compareHistory'), href: `/ci/${entityName}/${entityId}/history/${firstId}` },
                    ]}
                />
                <HistorySingleItemCompareContainer
                    View={(props) => {
                        return <HistoryCompareView ciTypeData={props.ciTypeData} dataFirst={props.dataFirst} dataSec={props.dataSec} isSimple />
                    }}
                />
            </>
        </CiHistoryPermissionsWrapper>
    )
}

export default CompareSinglePage
