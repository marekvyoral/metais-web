import { ISelectColumnType } from '@isdd/idsk-ui-kit/index'
import { ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'
import {
    Notification,
    NotificationsList,
    RemoveNotificationList200,
    RemoveNotificationListParams,
    RemoveNotifications200,
    RemoveNotificationsParams,
    SetAllNotificationsAsRead200,
    useGetNotificationListElastic,
    useRemoveNotificationList,
    useRemoveNotifications,
    useSetAllNotificationsAsRead,
} from '@isdd/metais-common/api/generated/notifications-swagger'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { UseMutateFunction } from '@tanstack/react-query'
import { ALL_EVENT_TYPES, NOTIFICATION_TITLE } from '@isdd/metais-common/components/constants'

import { firstLetterToLowerCase } from '@/components/views/notifications/notificationUtils'
import { selectedDefaultColumns } from '@/components/views/notifications/defaults'

export interface FilterData extends IFilterParams {
    eventType: string
    onlyUnread: boolean
    sortBy: string
    ascending?: boolean
}

export interface NotificationsListViewParams {
    data: NotificationsList | undefined
    isLoading: boolean
    isError: boolean
    defaultFilterValues: FilterData
    columns: ColumnDef<Notification>[]
    selectedColumns: ISelectColumnType[]
    setSelectedColumns: React.Dispatch<React.SetStateAction<ISelectColumnType[]>>
    listParams: {
        pageNumber: number
        perPage: number
    }
    setListParams: React.Dispatch<
        React.SetStateAction<{
            pageNumber: number
            perPage: number
        }>
    >
    sort: ColumnSort[]
    setSort: React.Dispatch<React.SetStateAction<ColumnSort[]>>
    mutateAllRead: UseMutateFunction<SetAllNotificationsAsRead200, unknown, void, unknown>
    mutateAllDelete: UseMutateFunction<
        RemoveNotifications200,
        unknown,
        {
            params?: RemoveNotificationsParams | undefined
        },
        unknown
    >
    mutateDelete: UseMutateFunction<
        RemoveNotificationList200,
        unknown,
        {
            params?: RemoveNotificationListParams | undefined
        },
        unknown
    >
}

interface INotificationsListContainer {
    View: React.FC<NotificationsListViewParams>
}

const defaultFilterValues: FilterData = {
    eventType: ALL_EVENT_TYPES,
    onlyUnread: false,
    sortBy: 'createdAt',
}

const NotificationsListContainer: React.FC<INotificationsListContainer> = ({ View }) => {
    const [sort, setSort] = useState<ColumnSort[]>([{ sortDirection: SortType.DESC, orderBy: 'CreatedAt' }])

    const { filter } = useFilterParams<FilterData>(defaultFilterValues)

    const [listParams, setListParams] = useState({
        pageNumber: 1,
        perPage: 10,
    })
    const { isLoading, isError, data } = useGetNotificationListElastic(
        {
            ...listParams,
            onlyUnread: filter.onlyUnread ?? false,
            fulltextSearch: filter.fullTextSearch,
            ...(filter.eventType != ALL_EVENT_TYPES && { eventType: filter.eventType }),
            sortBy: sort.length > 0 ? firstLetterToLowerCase(sort[0].orderBy) : 'createdAt',
            ascending: sort.length > 0 ? sort[0].sortDirection == 'ASC' : false,
        },
        { query: { queryKey: [filter.eventType, filter.onlyUnread, filter.fullTextSearch, sort] } },
    )
    const { mutate: mutateAllRead } = useSetAllNotificationsAsRead()
    const { mutate: mutateAllDelete } = useRemoveNotifications()
    const { mutate: mutateDelete } = useRemoveNotificationList()
    const [selectedColumns, setSelectedColumns] = useState<ISelectColumnType[]>([...selectedDefaultColumns])

    const columns = useMemo<ColumnDef<Notification>[]>(() => {
        const list: ColumnDef<Notification>[] = selectedColumns
            .filter((e) => e.selected)
            .map((e) =>
                e.technicalName == NOTIFICATION_TITLE
                    ? {
                          id: e.name,
                          header: e.name,
                          accessorKey: e.technicalName,
                          cell: (row) => <Link to={NavigationSubRoutes.NOTIFICATIONS + row.row.original.id}>{row.getValue() as string}</Link>,
                          enableSorting: true,
                      }
                    : { id: e.name, header: e.name, accessorKey: e.technicalName, enableSorting: true },
            )
        return list
    }, [selectedColumns])

    return (
        <View
            data={data}
            isLoading={isLoading}
            isError={isError}
            defaultFilterValues={defaultFilterValues}
            columns={columns}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            listParams={listParams}
            setListParams={setListParams}
            sort={sort}
            setSort={setSort}
            mutateAllDelete={mutateAllDelete}
            mutateAllRead={mutateAllRead}
            mutateDelete={mutateDelete}
        />
    )
}

export default NotificationsListContainer
