import { BreadCrumbs, Button, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { useReadConfigurationItem } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { CI_ITEM_QUERY_KEY, ENTITY_PROJECT, INVALIDATED, ciInformationTab } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useUserAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { ATTRIBUTE_NAME, MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { getDefaultCiEntityTabList, useGetEntityParamsFromUrl } from '@/componentHelpers/ci'
import { MainContentWrapper } from '@/components/MainContentWrapper'
import { ProjectStateContainer } from '@/components/containers/ProjectStateContainer'
import { RelationsListContainer } from '@/components/containers/RelationsListContainer'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { ProjectEntityIdHeader } from '@/components/views/ci/project/ProjectEntityIdHeader'
import { ProjectStateView } from '@/components/views/ci/project/ProjectStateView'

const ProjectEntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { isActionSuccess } = useActionSuccess()
    const { entityId } = useGetEntityParamsFromUrl()
    const navigate = useNavigate()
    const location = useLocation()
    const [selectedTab, setSelectedTab] = useState<string>()

    const {
        state: { user },
    } = useAuth()

    const isUserLogged = !!user

    document.title = `${t('titles.ciDetail', { ci: ENTITY_PROJECT })} | MetaIS`
    const userAbility = useUserAbility()

    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(ENTITY_PROJECT)
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

    const tabList: Tab[] = getDefaultCiEntityTabList({ userAbility, entityName: ENTITY_PROJECT, entityId: entityId ?? '', t })

    const isInvalidated = ciItemData?.metaAttributes?.state === INVALIDATED

    if (isUserLogged) {
        tabList.splice(2, 0, {
            id: 'activities',
            path: `/ci/${ENTITY_PROJECT}/${entityId}/activities`,
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
                    { label: ENTITY_PROJECT, href: `/ci/${ENTITY_PROJECT}` },
                    {
                        label: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                        href: `/ci/${ENTITY_PROJECT}/${entityId}`,
                    },
                ]}
            />

            <MainContentWrapper>
                <CiPermissionsWrapper entityId={entityId ?? ''} entityName={ENTITY_PROJECT ?? ''}>
                    <QueryFeedback loading={isCiItemDataLoading || isCiTypeDataLoading}>
                        <FlexColumnReverseWrapper>
                            <ProjectEntityIdHeader
                                editButton={
                                    <Button
                                        label={t('ciType.editButton')}
                                        onClick={() => navigate(`/ci/${ENTITY_PROJECT}/${entityId}/edit`, { state: location.state })}
                                    />
                                }
                                entityData={ciItemData}
                                entityName={ENTITY_PROJECT}
                                entityId={entityId ?? ''}
                                entityItemName={ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? 'Detail'}
                                ciRoles={ciTypeData?.roleList ?? []}
                                isInvalidated={isInvalidated}
                                refetchCi={refetch}
                            />
                            <QueryFeedback loading={false} error={isCiItemDataError || isCiTypeDataError} />
                            <MutationFeedback error={false} success={isActionSuccess.value} />
                        </FlexColumnReverseWrapper>
                        {user && <ProjectStateContainer configurationItemId={entityId ?? ''} View={(props) => <ProjectStateView {...props} />} />}
                        <Tabs tabList={tabList} onSelect={(selected) => setSelectedTab(selected.id)} />
                        {selectedTab === ciInformationTab && <RelationsListContainer entityId={entityId ?? ''} technicalName={ENTITY_PROJECT} />}
                    </QueryFeedback>
                </CiPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}

export default ProjectEntityDetailPage