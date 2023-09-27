import { BreadCrumbs, HomeIcon } from '@isdd/idsk-ui-kit/index'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { ATTRIBUTE_NAME, useReadConfigurationItem } from '@isdd/metais-common/api'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useParams } from 'react-router-dom'
import { MutationFeedback } from '@isdd/metais-common/index'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { Actions, useUserAbility } from '@isdd/metais-common/hooks/permissions/useUserAbility'

import NeighboursCardListWrapper from '@/components/entities/NeighboursCardListWrapper'
import { CiPermissionsWrapper } from '@/components/permissions/CiPermissionsWrapper'
import { CiEntityIdHeader } from '@/components/views/ci/CiEntityIdHeader'
import Informations from '@/pages/ci/[entityName]/[entityId]/informations'
import { MainContentWrapper } from '@/components/MainContentWrapper'

export const INDEX_ROUTE = Informations

const EntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { isActionSuccess } = useActionSuccess()
    const { entityId, entityName } = useParams()
    document.title = `${t('titles.ciDetail', { ci: entityName })} | MetaIS`
    const userAbility = useUserAbility()

    const tabList: Tab[] = [
        {
            id: 'informations',
            path: `/ci/${entityName}/${entityId}/`,
            title: t('ciType.informations'),
            content: <Outlet />,
        },
        {
            id: 'documents',
            path: `/ci/${entityName}/${entityId}/documents`,
            title: t('ciType.documents'),
            content: <Outlet />,
        },
        {
            id: 'relationships',
            path: `/ci/${entityName}/${entityId}/relationships`,
            title: t('ciType.relationships'),
            content: <Outlet />,
        },
        ...(userAbility.can(Actions.HISTORY, 'ci')
            ? [
                  {
                      id: 'history',
                      path: `/ci/${entityName}/${entityId}/history`,
                      title: t('ciType.history'),
                      content: <Outlet />,
                  },
              ]
            : []),
    ]

    const { data: ciItemData } = useReadConfigurationItem(entityId ?? '', {
        query: {
            queryKey: ['ciItemData', entityId],
        },
    })

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
                    <>
                        <FlexColumnReverseWrapper>
                            <CiEntityIdHeader
                                entityName={entityName ?? ''}
                                entityId={entityId ?? ''}
                                entityItemName={ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? 'Detail'}
                            />
                            <MutationFeedback error={false} success={isActionSuccess.value} />
                        </FlexColumnReverseWrapper>
                        <Tabs tabList={tabList} />
                        <NeighboursCardListWrapper entityId={entityId} entityName={entityName} tabList={tabList} />
                    </>
                </CiPermissionsWrapper>
            </MainContentWrapper>
        </>
    )
}

export default EntityDetailPage
