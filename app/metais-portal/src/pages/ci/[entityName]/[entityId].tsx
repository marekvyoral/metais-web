import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useParams } from 'react-router-dom'

import { Tabs } from '@/components/tabs/Tabs'

const ProjektEntityDetailPage: React.FC = () => {
    const { t } = useTranslation()
    const { entityId, entityName } = useParams()

    const tabList = [
        {
            id: `/ci/${entityName}/${entityId}/`,
            title: t('ciType.informations'),
            content: <Outlet />,
        },
        {
            id: `/ci/${entityName}/${entityId}/documents`,
            title: t('ciType.documents'),
            content: <Outlet />,
        },
        {
            id: `/ci/${entityName}/${entityId}/relationships`,
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
