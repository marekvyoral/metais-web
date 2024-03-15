import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { CI_ITEM_QUERY_KEY, INVALIDATED, PO, ciInformationTab } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useUserAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { ATTRIBUTE_NAME, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetCiTypeWrapper } from '@isdd/metais-common/hooks/useCiType.hook'

import { POEntityDetailHeader } from './POEntityDetailHeader'

import {
    getCiHowToBreadCrumb,
    getDefaultCiEntityTabList,
    useCiDetailPageTitle,
    useCiListPageHeading,
    useGetEntityParamsFromUrl,
} from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { RelationsListContainer } from '@/components/containers/RelationsListContainer'

const POEntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { isActionSuccess } = useActionSuccess()
    const { entityId, entityName: urlEntityName } = useGetEntityParamsFromUrl()

    const entityName = PO

    const userAbility = useUserAbility()
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiTypeWrapper(entityName ?? '')
    const [selectedTab, setSelectedTab] = useState<string>()

    const {
        data: ciItemData,
        isLoading: isCiItemDataLoading,
        isError: isCiItemDataError,
    } = useReadConfigurationItem(entityId ?? '', {
        query: {
            queryKey: [CI_ITEM_QUERY_KEY, entityId],
        },
    })

    const { getHeading } = useCiListPageHeading(ciTypeData?.name ?? '', t)
    const { getTitle } = useCiDetailPageTitle(ciTypeData?.name ?? '', ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov], t)
    document.title = getTitle()

    const tabList: Tab[] = getDefaultCiEntityTabList({ userAbility, entityName: urlEntityName ?? '', entityId: entityId ?? '', t })

    const isInvalidated = ciItemData?.metaAttributes?.state === INVALIDATED

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
                        href: `/ci/${urlEntityName}/${entityId}`,
                    },
                ]}
            />
            <MainContentWrapper>
                <CiPermissionsWrapper entityId={entityId ?? ''} entityName={entityName}>
                    <QueryFeedback loading={isCiItemDataLoading || isCiTypeDataLoading} error={isCiTypeDataError}>
                        <FlexColumnReverseWrapper>
                            <POEntityDetailHeader
                                isInvalidated={isInvalidated}
                                entityItemName={ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? 'Detail'}
                            />
                            <QueryFeedback loading={false} error={isCiItemDataError || isCiTypeDataError} />
                            <MutationFeedback
                                success={isActionSuccess.value && isActionSuccess.additionalInfo?.type !== 'relationCreated'}
                                successMessage={
                                    isActionSuccess.additionalInfo?.type === 'create'
                                        ? t('mutationFeedback.successfulCreated')
                                        : t('mutationFeedback.successfulUpdated')
                                }
                            />
                        </FlexColumnReverseWrapper>
                        <Tabs tabList={tabList} onSelect={(selected) => setSelectedTab(selected.id)} />

                        {selectedTab === ciInformationTab && <RelationsListContainer entityId={entityId ?? ''} technicalName={entityName ?? ''} />}
                    </QueryFeedback>
                </CiPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}

export default POEntityDetailPage
