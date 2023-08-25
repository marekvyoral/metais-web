import { BreadCrumbs } from '@isdd/idsk-ui-kit/index'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { ATTRIBUTE_NAME, useReadConfigurationItem } from '@isdd/metais-common/api'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useParams } from 'react-router-dom'

import NeighboursCardListWrapper from '@/components/entities/NeighboursCardListWrapper'
import { CiEntityIdHeader } from '@/components/views/ci/CiEntityIdHeader'
import Informations from '@/pages/ci/[entityName]/[entityId]/informations'

export const INDEX_ROUTE = Informations

const EntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { entityId, entityName } = useParams()

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
        {
            id: 'history',
            path: `/ci/${entityName}/${entityId}/history`,
            title: t('ciType.history'),
            content: <Outlet />,
        },
    ]

    const { data: ciItemData } = useReadConfigurationItem(entityId ?? '', {
        query: {
            queryKey: ['ciItemData', entityId],
        },
    })

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('breadcrumbs.home'), href: '/' },
                    { label: entityName, href: `/ci/${entityName}` },
                    {
                        label: ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? t('breadcrumbs.noName'),
                        href: `/ci/${entityName}/${entityId}`,
                    },
                ]}
            />
            <CiEntityIdHeader
                entityName={entityName ?? ''}
                entityId={entityId ?? ''}
                entityItemName={ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? 'Detail'}
            />
            <Tabs tabList={tabList} />
            <NeighboursCardListWrapper entityId={entityId} entityName={entityName} tabList={tabList} />
        </>
    )
}

export default EntityDetailPage
