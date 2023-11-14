import { BreadCrumbs, Button, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/api'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useUserAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { CI_ITEM_QUERY_KEY, INVALIDATED } from '@isdd/metais-common/constants'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetRights } from '@isdd/metais-common/api/generated/kris-swagger'

import Informations from './[entityId]/informations'

import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { CiEntityIdHeader } from '@/components/views/ci/CiEntityIdHeader'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { getDefaultCiEntityTabList, useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { RelationsListContainer } from '@/components/containers/RelationsListContainer'

export const INDEX_ROUTE = Informations

const EntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { isActionSuccess } = useActionSuccess()
    const { entityId, entityName } = useGetEntityParamsFromUrl()
    const { data: evaluationData, isLoading: isLoadingEvaluation, isError: IsErrorEvaluation } = useGetRights(entityId ?? '')
    const showEvaluation =
        evaluationData && evaluationData.hasVersions && !evaluationData.municipality && (evaluationData.creator || evaluationData.evaluator)

    document.title = `${t('titles.ciDetail', { ci: entityName })} | MetaIS`
    const userAbility = useUserAbility()

    const tabList: Tab[] = getDefaultCiEntityTabList({
        userAbility,
        entityName: entityName ?? '',
        entityId: entityId ?? '',
        t,
        showEvaluation,
    })

    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(entityName ?? '')
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
    const isInvalidated = ciItemData?.metaAttributes?.state === INVALIDATED

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: entityName, href: `/ci/${entityName}` },
                    {
                        label: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                        href: `/ci/${entityName}/${entityId}`,
                    },
                ]}
            />
            <MainContentWrapper>
                <CiPermissionsWrapper entityId={entityId ?? ''} entityName={entityName ?? ''}>
                    <QueryFeedback
                        loading={isCiItemDataLoading || isCiTypeDataLoading || isLoadingEvaluation}
                        error={isCiItemDataError || isCiTypeDataError || IsErrorEvaluation}
                        withChildren
                    >
                        <FlexColumnReverseWrapper>
                            <CiEntityIdHeader
                                editButton={
                                    <Button
                                        label={t('ciType.editButton')}
                                        onClick={() => navigate(`/ci/${entityName}/${entityId}/edit`, { state: location.state })}
                                    />
                                }
                                entityData={ciItemData}
                                entityName={entityName ?? ''}
                                entityId={entityId ?? ''}
                                entityItemName={ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? 'Detail'}
                                ciRoles={ciTypeData?.roleList ?? []}
                                isInvalidated={isInvalidated}
                                refetchCi={refetch}
                            />
                            <MutationFeedback error={false} success={isActionSuccess.value} />
                        </FlexColumnReverseWrapper>
                        <Tabs tabList={tabList} />

                        <RelationsListContainer entityId={entityId ?? ''} technicalName={entityName ?? ''} />
                    </QueryFeedback>
                </CiPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}

export default EntityDetailPage
