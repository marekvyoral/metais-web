import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import NotificationsDetailContainer from '@/components/containers/NotificationsDetailContainer'
import NotificationsDetailView from '@/components/views/notifications/NotificationsDetailView'

const NotificationsDetailPage = () => {
    const { t } = useTranslation()
    document.title = `${t('titles.notificationDetail')} | MetaIS`
    const { id } = useParams()

    return (
        <NotificationsDetailContainer
            id={id}
            View={(props) => <NotificationsDetailView id={props.id} data={props.data} isError={props.isError} isLoading={props.isLoading} />}
        />
    )
}

export default NotificationsDetailPage
