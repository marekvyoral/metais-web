import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useParams } from 'react-router-dom'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { TextHeading } from '@isdd/idsk-ui-kit/index'

import Informations from '@/pages/ci/[entityName]/[entityId]/informations'
import { RelationsListContainer } from '@/components/containers/RelationsListContainer'
import { NeighboursCardList } from '@/components/entities/NeighboursCardList'

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
    ]

    //need to call ciItemData here to show heading
    return (
        <>
            <TextHeading size="XL">Detail</TextHeading>
            <Tabs tabList={tabList} />
            <RelationsListContainer entityId={entityId ?? ''} technicalName={entityName ?? ''} View={NeighboursCardList} />
        </>
    )
}

export default EntityDetailPage
