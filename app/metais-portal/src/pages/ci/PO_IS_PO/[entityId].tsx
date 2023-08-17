import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useParams } from 'react-router-dom'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'
import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { ATTRIBUTE_NAME, useReadConfigurationItem } from '@isdd/metais-common/api'

import Informations from './[entityId]/informations'

import NeighboursCardListWrapper from '@/components/entities/NeighboursCardListWrapper'

export const INDEX_ROUTE = Informations

const EntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { entityId } = useParams()
    const entityName = 'PO_IS_PO'

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

    //need to call ciItemData here to show heading
    return (
        <>
            <TextHeading size="XL">{ciItemData?.attributes?.[ATTRIBUTE_NAME.Gen_Profil_nazov] ?? 'Detail'}</TextHeading>
            <Tabs tabList={tabList} />
            <NeighboursCardListWrapper entityId={entityId} entityName={entityName} tabList={tabList} />
        </>
    )
}

export default EntityDetailPage
