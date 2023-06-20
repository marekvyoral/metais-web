import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useParams } from 'react-router-dom'
import { Tab, Tabs } from '@isdd/idsk-ui-kit/tabs/Tabs'

const ProjektEntityDetailPage: React.FC = () => {
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

    return (
        <>
            <Tabs tabList={tabList} />
        </>
    )
}

export default ProjektEntityDetailPage
