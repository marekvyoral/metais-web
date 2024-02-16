import React from 'react'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import { NotificationsListContainer } from '@/components/containers/NotificationsListContainer'
import NotificationsListView from '@/components/views/notifications/NotificationsListView'

const NotificationsPage = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.notifications')} ${META_IS_TITLE}`
    return <NotificationsListContainer View={(props) => <NotificationsListView {...props} />} />
}

export default NotificationsPage
