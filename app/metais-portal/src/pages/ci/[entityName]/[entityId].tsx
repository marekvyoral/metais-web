import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { ATTRIBUTE_NAME, useReadConfigurationItem } from '@isdd/metais-common/api'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useParams } from 'react-router-dom'
import { MutationFeedback } from '@isdd/metais-common/index'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { IBulkActionResult } from '@isdd/metais-common/hooks/useBulkAction'
import { Actions, useUserAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { CI_ITEM_QUERY_KEY, ENTITY_PROJECT, INVALIDATED } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { shouldEntityNameBePO } from '@isdd/metais-common/src/componentHelpers/ci/entityNameHelpers'

import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { CiEntityIdHeader } from '@/components/views/ci/CiEntityIdHeader'
import Informations from '@/pages/ci/[entityName]/[entityId]/informations'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { ProjectStateContainer } from '@/components/containers/ProjectStateContainer'
import { ProjectStateView } from '@/components/views/ci/project/ProjectStateView'
import { RelationsListContainer } from '@/components/containers/RelationsListContainer'

export const INDEX_ROUTE = Informations

const EntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { isActionSuccess } = useActionSuccess()
    const { entityId, entityName: urlEntityName } = useParams()

    const entityName = shouldEntityNameBePO(urlEntityName ?? '')

    const {
        state: { user },
    } = useAuth()

    const isUserLogged = !!user
    const [bulkActionResult, setBulkActionResult] = useState<IBulkActionResult>()

    document.title = `${t('titles.ciDetail', { ci: urlEntityName })} | MetaIS`
    const userAbility = useUserAbility()

    const tabList: Tab[] = [
        {
            id: 'informations',
            path: `/ci/${urlEntityName}/${entityId}/`,
            title: t('ciType.informations'),
            content: <Outlet />,
        },
        {
            id: 'documents',
            path: `/ci/${urlEntityName}/${entityId}/documents`,
            title: t('ciType.documents'),
            content: <Outlet />,
        },

        {
            id: 'relationships',
            path: `/ci/${urlEntityName}/${entityId}/relationships`,
            title: t('ciType.relationships'),
            content: <Outlet />,
        },
        ...(userAbility.can(Actions.HISTORY, 'ci')
            ? [
                  {
                      id: 'history',
                      path: `/ci/${urlEntityName}/${entityId}/history`,
                      title: t('ciType.history'),
                      content: <Outlet />,
                  },
              ]
            : []),
    ]

    const { data: ciTypeData } = useGetCiType(entityName ?? '')
    const { data: ciItemData, refetch } = useReadConfigurationItem(entityId ?? '', {
        query: {
            queryKey: [CI_ITEM_QUERY_KEY, entityId],
        },
    })
    const isInvalidated = ciItemData?.metaAttributes?.state === INVALIDATED

    const handleBulkAction = (actionResult: IBulkActionResult) => {
        setBulkActionResult(actionResult)
        refetch()
    }

    if (urlEntityName == ENTITY_PROJECT && isUserLogged) {
        tabList.splice(2, 0, {
            id: 'activities',
            path: `/ci/${urlEntityName}/${entityId}/activities`,
            title: t('ciType.activities'),
            content: <Outlet />,
        })
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('breadcrumbs.home'), href: '/', icon: HomeIcon },
                    { label: urlEntityName, href: `/ci/${urlEntityName}` },
                    {
                        label: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                        href: `/ci/${urlEntityName}/${entityId}`,
                    },
                ]}
            />
            <MainContentWrapper>
                <CiPermissionsWrapper entityId={entityId ?? ''} entityName={entityName ?? ''}>
                    <>
                        <FlexColumnReverseWrapper>
                            <CiEntityIdHeader
                                entityData={ciItemData}
                                entityName={urlEntityName ?? ''}
                                entityId={entityId ?? ''}
                                entityItemName={ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? 'Detail'}
                                handleBulkAction={handleBulkAction}
                                ciRoles={ciTypeData?.roleList ?? []}
                                isInvalidated={isInvalidated}
                            />
                            <MutationFeedback error={false} success={isActionSuccess.value} />
                            {(bulkActionResult?.isError || bulkActionResult?.isSuccess) && (
                                <MutationFeedback
                                    success={bulkActionResult?.isSuccess}
                                    successMessage={bulkActionResult?.successMessage}
                                    error={bulkActionResult?.isError ? t('feedback.mutationErrorMessage') : ''}
                                />
                            )}
                        </FlexColumnReverseWrapper>
                        {entityName == ENTITY_PROJECT && (
                            <ProjectStateContainer
                                configurationItemId={entityId ?? ''}
                                View={(props) => {
                                    return (
                                        <>
                                            <ProjectStateView {...props} />
                                        </>
                                    )
                                }}
                            />
                        )}
                        <Tabs tabList={tabList} />
                        <RelationsListContainer entityId={entityId ?? ''} technicalName={entityName ?? ''} />
                    </>
                </CiPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}

export default EntityDetailPage
