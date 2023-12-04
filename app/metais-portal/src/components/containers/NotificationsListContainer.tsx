import { ISelectColumnType } from '@isdd/idsk-ui-kit/index'
import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
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
import {
    ALL_EVENT_TYPES,
    BASE_PAGE_NUMBER,
    BASE_PAGE_SIZE,
    NOTIFICATION_TITLE,
    notificationDefaultSelectedColumns,
} from '@isdd/metais-common/constants'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { UseMutateFunction } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

export interface FilterData extends IFilterParams, IFilter {
    eventType: string
    onlyUnread: boolean
}

export interface NotificationsListViewParams {
    data: NotificationsList | undefined
    isLoading: boolean
    isError: boolean
    isMutateLoading: boolean
    isMutateError: boolean
    defaultFilterValues: FilterData
    columns: ColumnDef<Notification>[]
    selectedColumns: ISelectColumnType[]
    setSelectedColumns: React.Dispatch<React.SetStateAction<ISelectColumnType[]>>
    resetSelectedColumns: () => void
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
    isMutateSuccess: boolean
    filterParams: FilterData
}

interface INotificationsListContainer {
    View: React.FC<NotificationsListViewParams>
}

const defaultFilterValues: FilterData = {
    eventType: ALL_EVENT_TYPES,
    onlyUnread: false,
    sort: [{ sortDirection: SortType.DESC, orderBy: 'createdAt' }],
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
}

const NotificationDateIdKeys = {
    CREATED_AT: 'createdAt',
    READED_AT: 'readedAt',
}

export const NotificationsListContainer: React.FC<INotificationsListContainer> = ({ View }) => {
    const { t, i18n } = useTranslation()
    const location = useLocation()

    const [data, setData] = useState<NotificationsList | undefined>()
    const { filter, handleFilterChange } = useFilterParams<FilterData>(defaultFilterValues)
    const fetchNotifications = useGetNotificationListElasticHook()
    const fetchProps = {
        perPage: filter.pageSize ?? BASE_PAGE_SIZE,
        pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
        onlyUnread: filter.onlyUnread ?? defaultFilterValues.onlyUnread,
        fulltextSearch: filter.fullTextSearch ?? '',
        ...(filter.eventType && filter.eventType != ALL_EVENT_TYPES && { eventType: filter.eventType }),
        sortBy: filter.sort?.at(0)?.orderBy,
        ascending: filter.sort?.at(0)?.sortDirection === SortType.ASC,
    }
    const {
        isLoading: isListLoading,
        isError: isListError,
        data: notificationListData,
    } = useGetNotificationListElastic(fetchProps, {
        query: { queryKey: [filter.eventType, filter.onlyUnread, filter.fullTextSearch, filter.sort, filter.pageNumber, filter.pageSize] },
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

    const {
        mutate: mutateAllRead,
        isLoading: isSetAllAsReadLoading,
        isError: isSetAllAsReadError,
        isSuccess: isSetAllAsReadSuccess,
    } = useSetAllNotificationsAsRead(onSuccessDelete)
    const {
        mutate: mutateAllDelete,
        isLoading: isDeleteAllLoading,
        isError: isDeleteAllError,
        isSuccess: isDeleteAllSuccess,
    } = useRemoveNotifications(onSuccessDelete)
    const {
        mutate: mutateDelete,
        isLoading: isDeleteLoading,
        isError: isDeleteError,
        isSuccess: isDeleteSuccess,
    } = useRemoveNotificationList(onSuccessDelete)

    const [selectedColumns, setSelectedColumns] = useState<ISelectColumnType[]>([])

    const translateColumns = (columnsArray: ISelectColumnType[]) => {
        return columnsArray.map((item) => ({
            ...item,
            name: t(`notifications.columnsNames.${item.technicalName}`),
        }))
    }

    useEffect(() => {
        if (selectedColumns.length > 0) {
            setSelectedColumns((prev) => translateColumns(prev))
        } else {
            setSelectedColumns(translateColumns(notificationDefaultSelectedColumns))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language])

    const columns = useMemo<ColumnDef<Notification>[]>(() => {
        const list: ColumnDef<Notification>[] = selectedColumns
            .filter((e) => e.selected)
            .map((e) =>
                e.technicalName == NOTIFICATION_TITLE
                    ? {
                          id: e.technicalName,
                          header: e.name,
                          accessorKey: e.technicalName,
                          size: 200,
                          meta: {
                              getCellContext: (ctx) => ctx?.getValue?.(),
                          },
                          cell: (row) => (
                              <Link to={NavigationSubRoutes.NOTIFICATIONS + '/' + row.row.original.id} state={{ from: location }}>
                                  {row.getValue() as string}
                              </Link>
                          ),
                          enableSorting: true,
                      }
                    : {
                          id: e.technicalName,
                          header: e.name,
                          accessorKey: e.technicalName,
                          enableSorting: true,
                          cell: (row) => {
                              const isDate = Object.values(NotificationDateIdKeys).includes(row.column.id)
                              if (isDate && row.getValue() != null) {
                                  return t('dateTime', { date: row.getValue() as string })
                              } else {
                                  row.getValue()
                              }
                          },
                          meta: {
                              getCellContext: (ctx) => {
                                  const isDate = Object.values(NotificationDateIdKeys).includes(ctx.column.id)
                                  if (isDate && ctx.getValue() != null) {
                                      return t('dateTime', { date: ctx.getValue() as string })
                                  } else {
                                      return ctx?.getValue?.()
                                  }
                              },
                          },
                      },
            )
        return list
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, selectedColumns, t, i18n.language])

    const isMutateSuccess = isSetAllAsReadSuccess || isDeleteAllSuccess || isDeleteSuccess
    const isMutateLoading = isSetAllAsReadLoading || isDeleteAllLoading || isDeleteLoading
    const isMutateError = isDeleteAllError || isDeleteError || isSetAllAsReadError

    return (
        <View
            handleFilterChange={handleFilterChange}
            data={data}
            isLoading={isListLoading}
            isError={isListError}
            defaultFilterValues={defaultFilterValues}
            columns={columns}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            resetSelectedColumns={() => setSelectedColumns(translateColumns(notificationDefaultSelectedColumns))}
            mutateAllDelete={mutateAllDelete}
            mutateAllRead={mutateAllRead}
            mutateDelete={mutateDelete}
            isMutateLoading={isMutateLoading}
            isMutateError={isMutateError}
            isMutateSuccess={isMutateSuccess}
            filterParams={filter}
        />
    )
}
