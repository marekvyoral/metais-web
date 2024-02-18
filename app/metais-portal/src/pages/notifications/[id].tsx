import React from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { META_IS_TITLE } from '@isdd/metais-common/constants'

import NotificationsDetailContainer from '@/components/containers/NotificationsDetailContainer'
import NotificationsDetailView from '@/components/views/notifications/NotificationsDetailView'

const NotificationsDetailPage = () => {
    const { t } = useTranslation()
    const { id } = useParams()

    return (
        <NotificationsDetailContainer
            id={id}
            View={(props) => {
                document.title = `${t('titles.notificationDetail', { itemName: props.data?.messagePerex ?? '' })} ${META_IS_TITLE}`
                return <NotificationsDetailView id={props.id} data={props.data} isError={props.isError} isLoading={props.isLoading} />
            }}
        />
    )
}

export default NotificationsDetailPage
