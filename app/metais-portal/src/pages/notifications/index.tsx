import React from 'react'
import { useTranslation } from 'react-i18next'

import { NotificationsListContainer } from '@/components/containers/NotificationsListContainer'
import NotificationsListView from '@/components/views/notifications/NotificationsListView'

const NotificationsPage = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.notifications')} | MetaIS`
    return <NotificationsListContainer View={(props) => <NotificationsListView {...props} />} />
}

export default NotificationsPage
