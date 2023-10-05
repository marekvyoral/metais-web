import React from 'react'
import { useParams } from 'react-router-dom'
import { BreadCrumbs } from '@isdd/idsk-ui-kit/bread-crumbs/BreadCrumbs'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useTranslation } from 'react-i18next'
import { CI_ITEM_QUERY_KEY } from '@isdd/metais-common/constants'

import { CiHistoryPermissionsWrapper } from '@/components/permissions/CiHistoryPermissionsWrapper'
import { HistoryCompareView } from '@/components/views/history/history-compare/HistoryCompareView'
import { HistorySingleItemCompareContainer } from '@/components/containers/HistorySingleItemCompareContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { AttributesContainer } from '@/components/containers/AttributesContainer'

const CompareSinglePage: React.FC = () => {
    const { t } = useTranslation()
    const { firstId, entityId, entityName } = useParams()
    const { data: ciItemData } = useReadConfigurationItem(entityId ?? '', {
        query: {
            queryKey: [CI_ITEM_QUERY_KEY, entityId],
        },
    })

    return (
        <AttributesContainer
            entityName={entityName ?? ''}
            View={({ data: attributesData }) => (
                <>
                    <CiHistoryPermissionsWrapper entityId={entityId ?? ''} entityName={entityName ?? ''}>
                        <>
                            <BreadCrumbs
                                withWidthContainer
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
                            <MainContentWrapper>
                                <HistorySingleItemCompareContainer
                                    View={(props) => {
                                        return (
                                            <HistoryCompareView
                                                ciTypeData={props.ciTypeData}
                                                dataFirst={props.dataFirst}
                                                dataSec={props.dataSec}
                                                attributesData={attributesData}
                                                isSimple
                                            />
                                        )
                                    }}
                                />
                            </MainContentWrapper>
                        </>
                    </CiHistoryPermissionsWrapper>
                </>
            )}
        />
    )
}

export default CompareSinglePage
