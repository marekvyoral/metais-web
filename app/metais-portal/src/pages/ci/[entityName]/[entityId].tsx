import { BreadCrumbs, Button, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { ATTRIBUTE_NAME, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { useUserAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'
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
import { getDefaultCiEntityTabList } from '@/componentHelpers/ci'

export const INDEX_ROUTE = Informations

const EntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { isActionSuccess } = useActionSuccess()
    const { entityId, entityName: urlEntityName } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const entityName = shouldEntityNameBePO(urlEntityName ?? '')

    const {
        state: { user },
    } = useAuth()

    const isUserLogged = !!user

    document.title = `${t('titles.ciDetail', { ci: urlEntityName })} | MetaIS`
    const userAbility = useUserAbility()

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

    const tabList: Tab[] = getDefaultCiEntityTabList({ userAbility, entityName: urlEntityName ?? '', entityId: entityId ?? '', t })

    const isInvalidated = ciItemData?.metaAttributes?.state === INVALIDATED

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
                    <QueryFeedback loading={isCiItemDataLoading || isCiTypeDataLoading}>
                        <FlexColumnReverseWrapper>
                            <CiEntityIdHeader
                                editButton={
                                    <Button
                                        label={t('ciType.editButton')}
                                        onClick={() => navigate(`/ci/${entityName}/${entityId}/edit`, { state: location.state })}
                                    />
                                }
                                entityData={ciItemData}
                                entityName={urlEntityName ?? ''}
                                entityId={entityId ?? ''}
                                entityItemName={ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? 'Detail'}
                                ciRoles={ciTypeData?.roleList ?? []}
                                isInvalidated={isInvalidated}
                                refetchCi={refetch}
                            />
                            <QueryFeedback loading={false} error={isCiItemDataError || isCiTypeDataError} />
                            <MutationFeedback error={false} success={isActionSuccess.value} />
                        </FlexColumnReverseWrapper>
                        {entityName == ENTITY_PROJECT && (
                            <ProjectStateContainer configurationItemId={entityId ?? ''} View={(props) => <ProjectStateView {...props} />} />
                        )}

                        <Tabs tabList={tabList} />

                        <RelationsListContainer entityId={entityId ?? ''} technicalName={entityName ?? ''} />
                    </QueryFeedback>
                </CiPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}

export default EntityDetailPage
