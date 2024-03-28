import { BreadCrumbs, HomeIcon, TextHeading } from '@isdd/idsk-ui-kit/index'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { CI_ITEM_QUERY_KEY, ciInformationTab } from '@isdd/metais-common/constants'
import { useAbilityContextWithFeedback } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { useUserAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { useGetCiTypeWrapper } from '@isdd/metais-common/hooks/useCiType.hook'
import { ATTRIBUTE_NAME, QueryFeedback } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
    getCiHowToBreadCrumb,
    getDefaultCiEntityTabList,
    useCiDetailPageTitle,
    useCiListPageHeading,
    useGetEntityParamsFromUrl,
} from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { RelationsListContainer } from '@/components/containers/RelationsListContainer'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { useCiCheckEntityTypeRedirectHook } from '@/hooks/useCiCheckEntityTypeRedirect.hook'

const ZCEntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { entityId, entityName } = useGetEntityParamsFromUrl()
    const userAbility = useUserAbility()

    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiTypeWrapper(entityName ?? '')

    const {
        data: ciItemData,
        isLoading: isCiItemDataLoading,
        isError: isCiItemDataError,
    } = useReadConfigurationItem(entityId ?? '', {
        query: {
            queryKey: [CI_ITEM_QUERY_KEY, entityId],
        },
    })

    const { isError: isAbilityError, isLoading: isAbilityLoading } = useAbilityContextWithFeedback()
    const [selectedTab, setSelectedTab] = useState<string>()

    useCiCheckEntityTypeRedirectHook(ciItemData, entityName)

    const { getHeading } = useCiListPageHeading(ciTypeData?.name ?? '', t)
    const { getTitle } = useCiDetailPageTitle(ciTypeData?.name ?? '', ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov], t)
    document.title = getTitle()

    const tabList: Tab[] = getDefaultCiEntityTabList({ userAbility, entityName: entityName ?? '', entityId: entityId ?? '', t })

    const isLoading = isCiItemDataLoading || isCiTypeDataLoading
    const isError = isCiItemDataError || isAbilityError || isCiTypeDataError

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
                    <QueryFeedback loading={isLoading || !!isAbilityLoading} error={isError}>
                        <TextHeading size="XL">{ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? 'Detail'}</TextHeading>
                        <Tabs tabList={tabList} onSelect={(selected) => setSelectedTab(selected.id)} />

                        {selectedTab === ciInformationTab && <RelationsListContainer entityId={entityId ?? ''} technicalName={entityName ?? ''} />}
                    </QueryFeedback>
                </CiPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}

export default ZCEntityDetailPage
