import React from 'react'
import { useParams } from 'react-router-dom'
import { BreadCrumbs } from '@isdd/idsk-ui-kit/bread-crumbs/BreadCrumbs'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useTranslation } from 'react-i18next'
import { CI_ITEM_QUERY_KEY } from '@isdd/metais-common/constants'
import { AttributesContainer } from '@isdd/metais-common/components/containers/AttributesContainer'
import { HomeIcon } from '@isdd/idsk-ui-kit/index'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { CiHistoryPermissionsWrapper } from '@/components/permissions/CiHistoryPermissionsWrapper'
import { HistoryCompareView } from '@/components/views/history/history-compare/HistoryCompareView'
import { HistorySingleItemCompareContainer } from '@/components/containers/HistorySingleItemCompareContainer'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

const RefRegistersCompareSinglePage: React.FC = () => {
    const { t } = useTranslation()
    const { firstId } = useParams()

    const { entityId } = useGetEntityParamsFromUrl()
    const entityName = 'ReferenceRegister'

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

export default RefRegistersCompareSinglePage
