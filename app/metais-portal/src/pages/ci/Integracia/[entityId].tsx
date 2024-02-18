import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { CI_ITEM_QUERY_KEY, META_IS_TITLE } from '@isdd/metais-common/constants'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Languages } from '@isdd/metais-common/localization/languages'
import { useUserAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'

import { getIntegrationLinkTabList, useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { IntegrationPermissionsWrapper } from '@/components/permissions/IntegrationPermissionsWrapper'
import { IntegrationLinkDetail } from '@/components/views/prov-integration/IntegrationLinkDetail'

export const IntegrationLinkDetailPage: React.FC = () => {
    const { t, i18n } = useTranslation()
    const { entityId, entityName } = useGetEntityParamsFromUrl()

    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(entityName ?? '')
    const ciTypeName = i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName

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
    document.title = `${t('titles.ciDetail', {
        ci: ciTypeName,
        itemName: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov],
    })} ${META_IS_TITLE}`
    const userAbility = useUserAbility()
    const tabList = getIntegrationLinkTabList({ entityName: entityName ?? '', entityId: entityId ?? '', t, userAbility })

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: ciTypeName, href: `/ci/${entityName}` },
                    {
                        label: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                        href: `/ci/${entityName}/${entityId}`,
                    },
                ]}
            />
            <MainContentWrapper>
                <IntegrationPermissionsWrapper entityId={entityId ?? ''} entityName={entityName ?? ''}>
                    <IntegrationLinkDetail
                        refetch={refetch}
                        entityId={entityId ?? ''}
                        entityName={entityName ?? ''}
                        ciItemData={ciItemData}
                        ciTypeData={ciTypeData}
                        isError={isCiItemDataError || isCiTypeDataError}
                        isLoading={isCiItemDataLoading || isCiTypeDataLoading}
                        tabList={tabList}
                    />
                </IntegrationPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}
