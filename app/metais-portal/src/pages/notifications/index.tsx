import React, { useCallback, useMemo, useState } from 'react'
import { BreadCrumbs, CheckBox, Filter, HomeIcon, ISelectColumnType, SimpleSelect, Table } from '@isdd/idsk-ui-kit/index'
import { ColumnDef, Row } from '@tanstack/react-table'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { Link } from 'react-router-dom'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useTranslation } from 'react-i18next'
import { ColumnSort, SortType } from '@isdd/idsk-ui-kit/types'
import { Notification, useGetNotificationListElastic } from '@isdd/metais-common/api/generated/notifications-swagger'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { ActionsGroup } from '../../components/views/notifications/ActionsGroup'
import { selectedDefaultColumns } from '../../components/views/notifications/defaults'
import { firstLetterToLowerCase, handleAllCheckboxChange, handleCheckboxChange } from '../../components/views/notifications/notificationUtils'

const ALL_EVENT_TYPES = 'All'
const NOTIFICATION_TITLE = 'messagePerex'
const NotificationsPage = () => {
    interface FilterData extends IFilterParams {
        eventType: string
        onlyUnread: boolean
        sortBy: string
        ascending?: boolean
    }
    const [sort, setSort] = useState<ColumnSort[]>([{ sortDirection: SortType.DESC, orderBy: 'CreatedAt' }])
    const { t } = useTranslation()
    const defaultFilterValues: FilterData = {
        eventType: ALL_EVENT_TYPES,
        onlyUnread: false,
        sortBy: 'createdAt',
    }
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

    const [rowSelection, setRowSelection] = useState<Record<string, Notification>>({})

    const isRowSelected = (row: Row<Notification>) => (row.original.id ? !!rowSelection[row.original.id] : false)

    const isRowBold = (row: Row<Notification>) => !row.original.readedAt

    const SelectableColumnsSpec = (tableData?: Notification[]): ColumnDef<Notification>[] => [
        {
            header: ({ table }) => {
                return (
                    <div className="govuk-checkboxes govuk-checkboxes--small">
                        <CheckBox
                            label=""
                            name="checkbox"
                            id="checkbox_all"
                            value="true"
                            onChange={() => {
                                handleAllCheckboxChange(table, tableData ?? [], rowSelection, setRowSelection)
                            }}
                            checked={table.getRowModel().rows.every((row) => (row.original.id ? !!rowSelection[row.original.id] : false))}
                        />
                    </div>
                )
            },
            id: CHECKBOX_CELL,
            cell: ({ row }) => (
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox
                        label=""
                        name="checkbox"
                        id={`checkbox_${row.id}`}
                        value="true"
                        onChange={() => {
                            handleCheckboxChange(row, rowSelection, setRowSelection)
                        }}
                        checked={row.original.id ? !!rowSelection[row.original.id] : false}
                    />
                </div>
            ),
        },
        ...columns,
    ]

    const clearSelectedRows = useCallback(() => setRowSelection({}), [])

    return (
        <>
            <BreadCrumbs
                links={[
                    { label: t('notifications.home'), href: RouteNames.HOME, icon: HomeIcon },
                    { label: t('notifications.notifications'), href: NavigationSubRoutes.NOTIFICATIONS },
                ]}
            />
            <Filter<FilterData>
                defaultFilterValues={defaultFilterValues}
                form={(register) => (
                    <div>
                        <SimpleSelect
                            {...register('eventType')}
                            id="1"
                            label={t('notifications.eventType')}
                            options={[
                                { value: undefined, label: ALL_EVENT_TYPES },
                                { value: 'INFO', label: t('notifications.INFO') },
                                { value: 'ERROR', label: t('notifications.ERROR') },
                            ]}
                        />
                        <CheckBox id="1" label={t('notifications.onlyUnread')} value="" {...register('onlyUnread')} />
                    </div>
                )}
            />
            <ActionsGroup
                setListParams={setListParams}
                listParams={listParams}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
                rowSelection={rowSelection}
            />

            <Table<Notification>
                onSortingChange={(newSort) => {
                    setSort(newSort)
                    clearSelectedRows()
                }}
                sort={sort}
                columns={SelectableColumnsSpec(data?.notifications)}
                isLoading={isLoading}
                error={isError}
                data={data?.notifications}
                isRowSelected={isRowSelected}
                isRowBold={isRowBold}
            />
        </>
    )
}

export default NotificationsPage
