import { BreadCrumbs, CheckBox, Filter, HomeIcon, SimpleSelect, Table } from '@isdd/idsk-ui-kit/index'
import { Notification } from '@isdd/metais-common/api/generated/notifications-swagger'
import { NavigationSubRoutes, RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { Row } from '@tanstack/react-table'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ALL_EVENT_TYPES } from '@isdd/metais-common/constants'

import { ActionsGroupView } from './ActionsGroupView'
import { SelectableColumnsSpec } from './notificationUtils'

import { FilterData, NotificationsListViewParams } from '@/components/containers/NotificationsListContainer'

const NotificationsListView: React.FC<NotificationsListViewParams> = ({
    data,
    isLoading,
    isError,
    defaultFilterValues,
    columns,
    selectedColumns,
    setSelectedColumns,
    listParams,
    setListParams,
    sort,
    setSort,
    mutateAllDelete,
    mutateAllRead,
    mutateDelete,
}) => {
    const { t } = useTranslation()

    const [rowSelection, setRowSelection] = useState<Record<string, Notification>>({})

    const isRowSelected = (row: Row<Notification>) => (row.original.id ? !!rowSelection[row.original.id] : false)
    const isRowBold = (row: Row<Notification>) => !row.original.readedAt

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
                form={({ register, setValue, filter }) => (
                    <div>
                        <SimpleSelect
                            id="eventType"
                            label={t('notifications.eventType')}
                            options={[
                                { value: ALL_EVENT_TYPES, label: ALL_EVENT_TYPES },
                                { value: 'INFO', label: t('notifications.INFO') },
                                { value: 'ERROR', label: t('notifications.ERROR') },
                            ]}
                            setValue={setValue}
                            defaultValue={filter.eventType || defaultFilterValues.eventType}
                            name="eventType"
                        />
                        <CheckBox id="1" label={t('notifications.onlyUnread')} value="" {...register('onlyUnread')} />
                    </div>
                )}
            />
            <ActionsGroupView
                setListParams={setListParams}
                listParams={listParams}
                selectedColumns={selectedColumns}
                setSelectedColumns={setSelectedColumns}
                rowSelection={rowSelection}
                mutateAllDelete={mutateAllDelete}
                mutateAllRead={mutateAllRead}
                mutateDelete={mutateDelete}
            />

            <Table<Notification>
                onSortingChange={(newSort) => {
                    setSort(newSort)
                    clearSelectedRows()
                }}
                sort={sort}
                columns={SelectableColumnsSpec(data?.notifications ?? [], columns, rowSelection, setRowSelection)}
                isLoading={isLoading}
                error={isError}
                data={data?.notifications}
                isRowSelected={isRowSelected}
                isRowBold={isRowBold}
            />
        </>
    )
}

export default NotificationsListView
