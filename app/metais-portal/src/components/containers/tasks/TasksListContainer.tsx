import { ColumnSort, Pagination, SortType } from '@isdd/idsk-ui-kit/types'
import { useGetValidEnum } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { Task, TaskState, useGetTasks } from '@isdd/metais-common/api/generated/tasks-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { TasksListView } from '@/components/views/tasks/TasksListView'
import { getGidsForUserOrgRoles, getUuidsForUserOrgRoles, mapPickerDateToRequestData } from '@/componentHelpers/tasks/tasks.helpers'

enum TaskFilterState {
    ACTIVE = 'ACTIVE',
    ALL = 'ALL',
    DONE = 'DONE',
}
interface TasksFilter extends IFilterParams {
    state: string
    appId?: string
    createdFrom?: string
    createdTo?: string
}

const defaultFilterValues: TasksFilter = {
    state: TaskFilterState.ALL,
    appId: 'ALL',
    createdFrom: undefined,
    createdTo: undefined,
}

export const TasksListContainer: React.FC = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const {
        state: { userInfo: user },
    } = useAuth()

    const columns: ColumnDef<Task>[] = [
        {
            id: 'name',
            header: t('tasks.tableHeaders.name'),
            accessorKey: 'name',
            cell: (row) => {
                return (
                    <Link to={`${RouteNames.TASKS}/${row.row.original.id}`} state={{ from: location }}>
                        {row.getValue() as string}
                    </Link>
                )
            },
            enableSorting: true,
        },
        { id: 'appId', header: t('tasks.tableHeaders.type'), accessorKey: 'appId', enableSorting: true, size: 120 },
        {
            id: 'state',
            accessorKey: 'state',
            header: t('tasks.tableHeaders.state'),
            cell: (row) => {
                return <span>{t(`tasks.${row.getValue()}`)}</span>
            },
            enableSorting: true,
            size: 120,
        },
        {
            id: 'createdAt',
            header: t('tasks.tableHeaders.createdAt'),
            accessorKey: 'createdAt',
            enableSorting: true,
            cell: (row) => {
                return <span>{t('dateTime', { date: row.getValue() })}</span>
            },
            size: 220,
        },
    ]
    const { data: appIds } = useGetValidEnum('TYPE_TASK_APP_ID')
    const { mutate, isError, isLoading, data, isIdle } = useGetTasks()
    const [sort, setSort] = useState<ColumnSort[]>([{ sortDirection: SortType.DESC, orderBy: 'name' }])
    const [pagination, setPagination] = useState<Pagination>({ pageNumber: 1, pageSize: 10, dataLength: 0 })

    const { filter: filterParams } = useFilterParams<TasksFilter>(defaultFilterValues)

    const getRequestStates = (state: string): TaskState[] => {
        switch (state) {
            case TaskFilterState.DONE:
                return [TaskState.DONE]
            case TaskFilterState.ACTIVE:
                return [TaskState.CREATED, TaskState.IN_PROGRESS]
            default:
                return []
        }
    }

    useEffect(() => {
        if (user) {
            const assignedTo = [user.login, ...getGidsForUserOrgRoles(user), ...getUuidsForUserOrgRoles(user)]
            mutate({
                data: {
                    assignedTo: assignedTo.filter((n, i) => assignedTo.indexOf(n) === i), //uniq
                    sortBy: sort[0]?.orderBy,
                    perPage: pagination.pageSize,
                    pageNumber: pagination.pageNumber,
                    ascending: sort[0]?.sortDirection === SortType.ASC,
                    states: getRequestStates(filterParams.state),
                    appId: filterParams.appId ? (filterParams.appId === TaskFilterState.ALL ? '' : filterParams.appId) : '',
                    createdFrom: mapPickerDateToRequestData(filterParams.createdFrom),
                    createdTo: mapPickerDateToRequestData(filterParams.createdTo),
                },
            })
        }
    }, [
        user,
        filterParams.appId,
        filterParams.createdFrom,
        filterParams.createdTo,
        filterParams.state,
        filterParams.fullTextSearch,
        pagination,
        sort,
        mutate,
    ])

    return (
        <TasksListView
            defaultFilterValues={defaultFilterValues}
            filterParams={filterParams}
            isError={isError}
            isIdle={isIdle}
            isLoading={isLoading}
            setPagination={setPagination}
            setSort={setSort}
            sort={sort}
            pagination={pagination}
            columns={columns}
            appIds={appIds}
            tasksData={data}
        />
    )
}
