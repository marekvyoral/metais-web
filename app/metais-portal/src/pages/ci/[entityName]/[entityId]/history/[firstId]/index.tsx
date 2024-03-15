import { BreadCrumbs } from '@isdd/idsk-ui-kit/bread-crumbs/BreadCrumbs'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { shouldEntityNameBePO } from '@isdd/metais-common/componentHelpers/ci/entityNameHelpers'
import { CI_ITEM_QUERY_KEY } from '@isdd/metais-common/constants'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useGetCiTypeWrapper } from '@isdd/metais-common/hooks/useCiType.hook'

import { getCiHowToBreadCrumb, useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { HistorySingleItemCompareContainer } from '@/components/containers/HistorySingleItemCompareContainer'
import { CiHistoryPermissionsWrapper } from '@/components/permissions/CiHistoryPermissionsWrapper'
import { HistoryCompareView } from '@/components/views/history/history-compare/HistoryCompareView'

const CompareSinglePage: React.FC = () => {
    const { t } = useTranslation()
    const { firstId } = useParams()

    let { entityName } = useGetEntityParamsFromUrl()
    const { entityId } = useGetEntityParamsFromUrl()
    entityName = shouldEntityNameBePO(entityName ?? '')

    const { data: ciTypeData } = useGetCiTypeWrapper(entityName)
    const { data: ciItemData } = useReadConfigurationItem(entityId ?? '', {
        query: {
            queryKey: [CI_ITEM_QUERY_KEY, entityId],
        },
    })

    return (
        <CiHistoryPermissionsWrapper entityId={entityId ?? ''} entityName={entityName ?? ''}>
            <>
                <BreadCrumbs
                    withWidthContainer
                    links={[
                        { label: t('breadcrumbs.home'), href: '/' },
                        ...getCiHowToBreadCrumb(entityName ?? '', t),
                        { label: t('titles.ciList', { ci: ciTypeData?.name }), href: `/ci/${entityName}` },
                        {
                            label: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                            href: `/ci/${entityName}/${entityId}`,
                        },
                        { label: t('breadcrumbs.compareHistory'), href: `/ci/${entityName}/${entityId}/history/${firstId}` },
                    ]}
                />
                <MainContentWrapper>
                    <HistorySingleItemCompareContainer
                        entityName={entityName ?? ''}
                        entityId={entityId ?? ''}
                        firstId={firstId ?? ''}
                        View={(props) => {
                            return <HistoryCompareView {...props} isSimple />
                        }}
                    />
                </MainContentWrapper>
            </>
        </CiHistoryPermissionsWrapper>
    )
}

export default CompareSinglePage
