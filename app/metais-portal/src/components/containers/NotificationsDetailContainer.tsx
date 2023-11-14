import { Notification, useGetNotificationDetail, useSetNotificationAsRead } from '@isdd/metais-common/api/generated/notifications-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React, { useEffect } from 'react'

export interface FilterData extends IFilterParams {
    eventType: string
    onlyUnread: boolean
    sortBy: string
    ascending?: boolean
}

export interface NotificationsDetailViewParams {
    data: Notification | undefined
    id: string
    isLoading: boolean
    isError: boolean
}

interface INotificationsDetailContainer {
    id?: string
    View: React.FC<NotificationsDetailViewParams>
}

const NotificationsDetailContainer: React.FC<INotificationsDetailContainer> = ({ View, id }) => {
    const idNumber = Number(id)
    const { data, isLoading, isError } = useGetNotificationDetail(idNumber)
    const { mutate: setAsRead } = useSetNotificationAsRead()
    useEffect(() => {
        setAsRead({ id: idNumber })
    }, [idNumber, setAsRead])

    return <View data={data} id={id ?? ''} isLoading={isLoading} isError={isError} />
}

export default NotificationsDetailContainer
