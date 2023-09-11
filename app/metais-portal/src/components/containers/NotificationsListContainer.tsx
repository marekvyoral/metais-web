import { ISelectColumnType } from '@isdd/idsk-ui-kit/index'
import { ColumnSort, IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import {
    Notification,
    NotificationsList,
    RemoveNotificationList200,
    RemoveNotificationListParams,
    RemoveNotifications200,
    RemoveNotificationsParams,
    SetAllNotificationsAsRead200,
    useGetNotificationListElastic,
    useGetNotificationListElasticHook,
    useRemoveNotificationList,
    useRemoveNotifications,
    useSetAllNotificationsAsRead,
} from '@isdd/metais-common/api/generated/notifications-swagger'
import { ALL_EVENT_TYPES, NOTIFICATION_TITLE, notificationDefaultSelectedColumns } from '@isdd/metais-common/constants'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryFeedback } from '@isdd/metais-common/index'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { UseMutateFunction } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { firstLetterToLowerCase } from '@/components/views/notifications/notificationUtils'
export interface FilterData extends IFilterParams, IFilter {
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
    handleFilterChange: (changedFilter: IFilter) => void
}

interface INotificationsListContainer {
    View: React.FC<NotificationsListViewParams>
}

const defaultFilterValues: FilterData = {
    eventType: ALL_EVENT_TYPES,
    onlyUnread: false,
    sortBy: 'createdAt',
    pageNumber: 1,
    pageSize: 10,
}

export const NotificationsListContainer: React.FC<INotificationsListContainer> = ({ View }) => {
    const location = useLocation()
    const [sort, setSort] = useState<ColumnSort[]>([{ sortDirection: SortType.DESC, orderBy: 'CreatedAt' }])

    const [data, setData] = useState<NotificationsList | undefined>()
    const { filter, handleFilterChange } = useFilterParams<FilterData>(defaultFilterValues)
    const fetchNotifications = useGetNotificationListElasticHook()
    const fetchProps = {
        perPage: filter.pageSize ?? 10,
        pageNumber: filter.pageNumber ?? 1,
        onlyUnread: filter.onlyUnread ?? false,
        fulltextSearch: filter.fullTextSearch ?? '',
        ...(filter.eventType && filter.eventType != ALL_EVENT_TYPES && { eventType: filter.eventType }),
        sortBy: sort.length > 0 ? firstLetterToLowerCase(sort[0].orderBy) : 'createdAt',
        ascending: sort.length > 0 ? sort[0].sortDirection == 'ASC' : false,
    }
    const {
        isLoading: isListLoading,
        isError,
        data: notificationListData,
    } = useGetNotificationListElastic(fetchProps, {
        query: { queryKey: [filter.eventType, filter.onlyUnread, filter.fullTextSearch, sort, filter.pageNumber, filter.pageSize] },
    })

    useEffect(() => {
        setData(notificationListData)
    }, [notificationListData])

    const onSuccessDelete = {
        mutation: {
            async onSuccess() {
                setData(await fetchNotifications(fetchProps))
            },
        },
    }

    const { mutate: mutateAllRead, isLoading: isSetAllAsReadLoading } = useSetAllNotificationsAsRead(onSuccessDelete)
    const { mutate: mutateAllDelete, isLoading: isDeleteAllLoading } = useRemoveNotifications(onSuccessDelete)
    const { mutate: mutateDelete, isLoading: isDeleteLoading } = useRemoveNotificationList(onSuccessDelete)
    const [selectedColumns, setSelectedColumns] = useState<ISelectColumnType[]>([...notificationDefaultSelectedColumns])
    const columns = useMemo<ColumnDef<Notification>[]>(() => {
        const list: ColumnDef<Notification>[] = selectedColumns
            .filter((e) => e.selected)
            .map((e) =>
                e.technicalName == NOTIFICATION_TITLE
                    ? {
                          id: e.name,
                          header: e.name,
                          accessorKey: e.technicalName,
                          cell: (row) => (
                              <Link to={NavigationSubRoutes.NOTIFICATIONS + '/' + row.row.original.id} state={{ from: location }}>
                                  {row.getValue() as string}
                              </Link>
                          ),
                          enableSorting: true,
                      }
                    : { id: e.name, header: e.name, accessorKey: e.technicalName, enableSorting: true },
            )
        return list
    }, [location, selectedColumns])
    const isLoading = isListLoading || isSetAllAsReadLoading || isDeleteAllLoading || isDeleteLoading
    return (
        <QueryFeedback loading={isLoading}>
            <View
                handleFilterChange={handleFilterChange}
                data={data}
                isLoading={isListLoading}
                isError={isError}
                defaultFilterValues={defaultFilterValues}
                columns={columns}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
                sort={sort}
                setSort={setSort}
                mutateAllDelete={mutateAllDelete}
                mutateAllRead={mutateAllRead}
                mutateDelete={mutateDelete}
            />
        </QueryFeedback>
    )
}
