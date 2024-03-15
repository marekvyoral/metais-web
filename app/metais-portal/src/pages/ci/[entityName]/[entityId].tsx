import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { Tab } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { CI_ITEM_QUERY_KEY } from '@isdd/metais-common/constants'
import { useUserAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useGetCiTypeWrapper } from '@isdd/metais-common/hooks/useCiType.hook'

import {
    getCiHowToBreadCrumb,
    getDefaultCiEntityTabList,
    useCiDetailPageTitle,
    useCiListPageHeading,
    useGetEntityParamsFromUrl,
} from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { CiEntityDetailView } from '@/components/views/ci/detail/CiEntityDetailView'

const EntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { entityId, entityName } = useGetEntityParamsFromUrl()
    const userAbility = useUserAbility()

    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiTypeWrapper(entityName ?? '')

    const {
        data: ciItemData,
        isLoading: isCiItemDataLoading,
        isError: isCiItemDataError,
        refetch,
    } = useReadConfigurationItem(entityId ?? '', {
        query: {
            queryKey: [CI_ITEM_QUERY_KEY, entityId],
        },
    })

    const { getHeading } = useCiListPageHeading(ciTypeData?.name ?? '', t)
    const { getTitle } = useCiDetailPageTitle(ciTypeData?.name ?? '', ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov], t)
    document.title = getTitle()

    const tabList: Tab[] = getDefaultCiEntityTabList({ userAbility, entityName: entityName ?? '', entityId: entityId ?? '', t })

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    ...getCiHowToBreadCrumb(entityName ?? '', t),
                    { label: getHeading(), href: `/ci/${entityName}` },
                    {
                        label: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                        href: `/ci/${entityName}/${entityId}`,
                    },
                ]}
            />

            <MainContentWrapper>
                <CiPermissionsWrapper entityId={entityId ?? ''} entityName={entityName ?? ''}>
                    <CiEntityDetailView
                        isError={isCiItemDataError || isCiTypeDataError}
                        isLoading={isCiItemDataLoading || isCiTypeDataLoading}
                        ciItemData={ciItemData}
                        ciTypeData={ciTypeData}
                        ciItemDataRefetch={refetch}
                        tabList={tabList}
                        entityId={entityId ?? ''}
                        entityName={entityName ?? ''}
                    />
                </CiPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}

export default EntityDetailPage
