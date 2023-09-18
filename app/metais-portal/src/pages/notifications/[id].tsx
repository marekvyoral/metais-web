import { useParams } from 'react-router-dom'
import React from 'react'

import NotificationsDetailContainer from '@/components/containers/NotificationsDetailContainer'
import NotificationsDetailView from '@/components/views/notifications/NotificationsDetailView'

const NotificationsDetailPage = () => {
    const { id } = useParams()

    return (
        <NotificationsDetailContainer
            id={id}
            View={(props) => <NotificationsDetailView id={props.id} data={props.data} isError={props.isError} isLoading={props.isLoading} />}
        />
    )
}

export default NotificationsDetailPage
