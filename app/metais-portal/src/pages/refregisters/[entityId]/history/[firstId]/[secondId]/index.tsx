import { BreadCrumbs } from '@isdd/idsk-ui-kit/bread-crumbs/BreadCrumbs'
import { HomeIcon } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { CI_ITEM_QUERY_KEY, REFERENCE_REGISTER } from '@isdd/metais-common/constants'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { formatTitleString } from '@isdd/metais-common/utils/utils'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { HistoryItemsCompareContainer } from '@/components/containers/HistoryItemsCompareContainer'
import { CiHistoryPermissionsWrapper } from '@/components/permissions/CiHistoryPermissionsWrapper'
import { HistoryCompareView } from '@/components/views/history/history-compare/HistoryCompareView'

const RefRegistersComparePage: React.FC = () => {
    const { t } = useTranslation()
    const { firstId, secondId } = useParams()
    const { entityId } = useGetEntityParamsFromUrl()
    const entityName = REFERENCE_REGISTER
    const { data: ciItemData } = useReadConfigurationItem(entityId ?? '', {
        query: {
            queryKey: [CI_ITEM_QUERY_KEY, entityId],
        },
    })
    document.title = formatTitleString(t('breadcrumbs.compareHistory'))

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
                    <HistoryItemsCompareContainer
                        entityId={entityId ?? ''}
                        entityName={entityName ?? ''}
                        firstId={firstId ?? ''}
                        secondId={secondId ?? ''}
                        View={(props) => {
                            return <HistoryCompareView {...props} />
                        }}
                    />
                </MainContentWrapper>
            </>
        </CiHistoryPermissionsWrapper>
    )
}

export default RefRegistersComparePage
