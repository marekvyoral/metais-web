import { BreadCrumbs, Button, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { CI_ITEM_QUERY_KEY, ENTITY_PRINCIP, INVALIDATED } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useUserAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { ATTRIBUTE_NAME, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { getDefaultCiEntityTabList, useCiDetailPageTitle, useCiListPageHeading, useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { CiEntityIdHeader } from '@/components/views/ci/CiEntityIdHeader'

const PrincipleEntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { isActionSuccess } = useActionSuccess()
    const { entityId } = useGetEntityParamsFromUrl()
    const navigate = useNavigate()
    const location = useLocation()
    const userAbility = useUserAbility()

    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(ENTITY_PRINCIP)
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

    const tabList: Tab[] = getDefaultCiEntityTabList({ userAbility, entityName: ENTITY_PRINCIP, entityId: entityId ?? '', t })

    const isInvalidated = ciItemData?.metaAttributes?.state === INVALIDATED

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: getHeading(), href: `/ci/${ENTITY_PRINCIP}` },
                    {
                        label: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                        href: `/ci/${ENTITY_PRINCIP}/${entityId}`,
                    },
                ]}
            />

            <MainContentWrapper>
                <CiPermissionsWrapper entityId={entityId ?? ''} entityName={ENTITY_PRINCIP}>
                    <QueryFeedback loading={isCiItemDataLoading || isCiTypeDataLoading}>
                        <FlexColumnReverseWrapper>
                            <CiEntityIdHeader
                                editButton={
                                    <Button
                                        label={t('ciType.editButton')}
                                        onClick={() => navigate(`/ci/${ENTITY_PRINCIP}/${entityId}/edit`, { state: location.state })}
                                    />
                                }
                                entityData={ciItemData}
                                entityName={ENTITY_PRINCIP}
                                entityId={entityId ?? ''}
                                entityItemName={ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? 'Detail'}
                                ciRoles={ciTypeData?.roleList ?? []}
                                isInvalidated={isInvalidated}
                                refetchCi={refetch}
                            />
                            <QueryFeedback loading={false} error={isCiItemDataError || isCiTypeDataError} />
                            {isActionSuccess.value && isActionSuccess.additionalInfo?.type !== 'relationCreated' && (
                                <MutationFeedback
                                    error={false}
                                    success={isActionSuccess.value}
                                    successMessage={
                                        isActionSuccess.additionalInfo?.type === 'create'
                                            ? t('mutationFeedback.successfulCreated')
                                            : t('mutationFeedback.successfulUpdated')
                                    }
                                />
                            )}
                        </FlexColumnReverseWrapper>
                        <Tabs tabList={tabList} />
                    </QueryFeedback>
                </CiPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}

export default PrincipleEntityDetailPage
