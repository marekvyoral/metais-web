import { BreadCrumbs } from '@isdd/idsk-ui-kit/bread-crumbs/BreadCrumbs'
import { HomeIcon } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { CI_ITEM_QUERY_KEY, REFERENCE_REGISTER } from '@isdd/metais-common/constants'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { HistorySingleItemCompareContainer } from '@/components/containers/HistorySingleItemCompareContainer'
import { CiHistoryPermissionsWrapper } from '@/components/permissions/CiHistoryPermissionsWrapper'
import { HistoryCompareView } from '@/components/views/history/history-compare/HistoryCompareView'

const RefRegistersCompareSinglePage: React.FC = () => {
    const { t } = useTranslation()
    const { firstId } = useParams()

    const { entityId } = useGetEntityParamsFromUrl()
    const entityName = REFERENCE_REGISTER

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
                        { label: t('breadcrumbs.home'), href: RouteNames.HOME, icon: HomeIcon },
                        { label: t('breadcrumbs.dataObjects'), href: RouteNames.HOW_TO_DATA_OBJECTS },
                        { label: t('breadcrumbs.refRegisters'), href: RouteNames.REFERENCE_REGISTERS },
                        {
                            label: ciItemData?.attributes?.[ATTRIBUTE_NAME.ReferenceRegister_Profile_name] ?? t('breadcrumbs.noName'),
                            href: `/refregisters/${entityId}/history`,
                        },
                        { label: t('breadcrumbs.compareHistory'), href: `/refregisters/${entityId}/history/${firstId}` },
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

export default RefRegistersCompareSinglePage
