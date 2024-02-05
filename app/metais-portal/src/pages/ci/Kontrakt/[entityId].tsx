import { BreadCrumbs, Button, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { CI_ITEM_QUERY_KEY, INVALIDATED } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useScroll } from '@isdd/metais-common/hooks/useScroll'
import { ATTRIBUTE_NAME, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { RouterRoutes } from '@isdd/metais-common/navigation/routeNames'
import { useUserAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { Languages } from '@isdd/metais-common/localization/languages'

import { getSlaContractTabList, useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { CiEntityIdHeader } from '@/components/views/ci/CiEntityIdHeader'
import { RelationsListContainer } from '@/components/containers/RelationsListContainer'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'

export const SlaContractDetailPage: React.FC = () => {
    const { t, i18n } = useTranslation()
    const { isActionSuccess } = useActionSuccess()
    const { entityId, entityName } = useGetEntityParamsFromUrl()
    const navigate = useNavigate()
    const location = useLocation()

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

    const userAbility = useUserAbility()
    const entityItemName = ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov]
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(entityName ?? '')
    const ciTypeName = i18n.language === Languages.SLOVAK ? ciTypeData?.name : ciTypeData?.engName
    document.title = `${t('titles.ciDetail', { ci: ciTypeName })} | MetaIS`

    const tabList: Tab[] = getSlaContractTabList({ userAbility, entityName: entityName ?? '', entityId: entityId ?? '', t })
    const isInvalidated = ciItemData?.metaAttributes?.state === INVALIDATED

    const { wrapperRef, scrollToMutationFeedback } = useScroll()

    useEffect(() => {
        if (isActionSuccess.value) {
            scrollToMutationFeedback()
        }
    }, [isActionSuccess, scrollToMutationFeedback])

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: t('slaContracts.heading'), href: RouterRoutes.SLA_CONTRACT_LIST },
                    { label: entityItemName, href: `${RouterRoutes.SLA_CONTRACT_LIST}/${entityId}` },
                ]}
            />

            <MainContentWrapper>
                <CiPermissionsWrapper entityId={entityId ?? ''} entityName={entityName ?? ''}>
                    <QueryFeedback loading={isCiItemDataLoading || isCiTypeDataLoading} error={isCiTypeDataError}>
                        <FlexColumnReverseWrapper>
                            <CiEntityIdHeader
                                editButton={
                                    <Button
                                        label={t('ciType.editButton')}
                                        onClick={() => navigate(`/ci/${entityName}/${entityId}/edit`, { state: location.state })}
                                    />
                                }
                                entityData={ciItemData}
                                entityId={entityId ?? ''}
                                entityItemName={entityItemName ?? 'Detail'}
                                isInvalidated={isInvalidated}
                                refetchCi={refetch}
                                entityName={entityName ?? ''}
                                ciRoles={[]}
                            />
                            <QueryFeedback loading={false} error={isCiItemDataError} />
                            {isActionSuccess.value && isActionSuccess.additionalInfo?.type !== 'relationCreated' && (
                                <div ref={wrapperRef}>
                                    <MutationFeedback
                                        error={false}
                                        success={isActionSuccess.value}
                                        successMessage={
                                            isActionSuccess.additionalInfo?.type === 'create'
                                                ? t('mutationFeedback.successfulCreated')
                                                : t('mutationFeedback.successfulUpdated')
                                        }
                                    />
                                </div>
                            )}
                        </FlexColumnReverseWrapper>

                        <Tabs tabList={tabList} />

                        <RelationsListContainer
                            entityId={entityId ?? ''}
                            technicalName={entityName ?? ''}
                            showOnlyTabsWithRelations
                            hideButtons
                            hidePageSizeSelect
                        />
                    </QueryFeedback>
                </CiPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}
