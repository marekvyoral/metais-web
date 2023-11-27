import { Task, TaskState, useGetTasks } from '@isdd/metais-common/api/generated/tasks-swagger'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'
import { ColumnDef } from '@tanstack/react-table'
import { ColumnSort, Pagination, SortType } from '@isdd/idsk-ui-kit/types'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { Button, ButtonGroupRow, GridCol, GridRow, Input } from '@isdd/idsk-ui-kit/index'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { yupResolver } from '@hookform/resolvers/yup'
import { ObjectSchema } from 'yup'
import { MutationFeedback, QueryFeedback } from '@isdd/metais-common/index'
import { Identity } from '@isdd/metais-common/api/generated/iam-swagger'

import { useCreateTasksSchema } from '@/components/views/tasks/useTasksSchema'
import { TasksFilter, TasksListView } from '@/components/views/tasks/TasksListView'
import { mapPickerDateToRequestData } from '@/componentHelpers/tasks/tasks.helpers'
import { IdentitySelect } from '@/components/identity-lazy-select/IdentitySelect'

export interface IKritTasksListView {
    entityId: string
    appIds: EnumType | undefined
    isLoading: boolean
    isError: boolean
    isSuccessSave: boolean
    onSaveForm: (task: Task, callback: () => void) => void
}

enum TaskFilterState {
    ACTIVE = 'ACTIVE',
    ALL = 'ALL',
    DONE = 'DONE',
}

const defaultFilterValues: TasksFilter = {
    state: TaskFilterState.ALL,
    appId: 'KRIS',
    createdFrom: undefined,
    createdTo: undefined,
}

export interface IItemTask {
    schema: ObjectSchema<{
        name: string
        description: string
        deadline: string
        user: string
    }>
}

export const KritTasksListView: React.FC<IKritTasksListView> = ({ entityId, appIds, onSaveForm, isLoading, isError, isSuccessSave }) => {
    const { t } = useTranslation()
    const {
        state: { user },
    } = useAuth()
    const { schema } = useCreateTasksSchema()
    const [sort, setSort] = useState<ColumnSort[]>([{ sortDirection: SortType.DESC, orderBy: 'name' }])
    const [pagination, setPagination] = useState<Pagination>({ pageNumber: 1, pageSize: 10, dataLength: 0 })
    const [showForm, setShowForm] = useState(false)
    const [seed, setSeed] = useState(1)
    const [defaultValue, setDefaultValue] = useState<Identity | undefined>(undefined)
    const { filter: filterParams } = useFilterParams<TasksFilter>(defaultFilterValues)
    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    })
    const { mutate, isError: isErrorTasks, isLoading: isLoadingTasks, data, isIdle } = useGetTasks()

    const columns: ColumnDef<Task>[] = [
        {
            id: 'name',
            header: t('tasks.tableHeaders.name'),
            accessorKey: 'name',
            cell: (row) => {
                return (
                    <Link to={`${RouteNames.TASKS}/${row.row.original.id}`} target="_blank" className="govuk-link">
                        {row.getValue() as string}
                    </Link>
                )
            },
            meta: { getCellContext: (ctx) => ctx?.getValue?.() as string },
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

    const getMutateData = useCallback(() => {
        reset()
        if (user) {
            mutate({
                data: {
                    sortBy: sort[0]?.orderBy,
                    perPage: pagination.pageSize,
                    pageNumber: pagination.pageNumber,
                    ascending: sort[0]?.sortDirection === SortType.ASC,
                    states: getRequestStates(filterParams.state),
                    appId: filterParams.appId ? (filterParams.appId === TaskFilterState.ALL ? '' : filterParams.appId) : '',
                    createdFrom: mapPickerDateToRequestData(filterParams.createdFrom),
                    createdTo: mapPickerDateToRequestData(filterParams.createdTo),
                    entityRef: entityId,
                },
            })
        }
    }, [
        entityId,
        filterParams.appId,
        filterParams.createdFrom,
        filterParams.createdTo,
        filterParams.state,
        mutate,
        pagination.pageNumber,
        pagination.pageSize,
        reset,
        sort,
        user,
    ])

    useEffect(() => {
        if (user) {
            getMutateData()
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
        entityId,
        setValue,
        getMutateData,
    ])

    useEffect(() => {
        if (user && showForm) {
            setDefaultValue({ uuid: user.uuid, displayName: user.displayName })
            setValue('user', user.uuid)
        }
    }, [user, showForm, setValue])

    useEffect(() => {
        // SelectLazyLoading component does not rerender on defaultValue change.
        // Once default value is set, it cant be changed.
        // Change of key forces the component to render changed default value.
        setSeed(Math.random())
    }, [defaultValue])

    const onSave = (formData: FieldValues) => {
        const newTask = {
            appId: 'KRIS',
            name: formData.name,
            assignedTo: formData?.user,
            createdBy: user?.preferred_username,
            description: formData.description,
            dueDate: new Date(formData.deadline).toISOString(),
            entityRef: entityId,
        } as Task

        setShowForm(false)
        onSaveForm(newTask, getMutateData)
    }

    const isLoadingData = [isLoadingTasks, isLoading].some((item) => item)
    const isErrorData = [isErrorTasks, isError].some((item) => item)

    return (
        <QueryFeedback loading={isLoadingTasks} error={isErrorTasks} withChildren>
            <MutationFeedback success={isSuccessSave} successMessage={t('tasksKris.successMsg')} error={undefined} />
            {showForm ? (
                <form onSubmit={handleSubmit(onSave)}>
                    <GridRow>
                        <GridCol setWidth="one-half">
                            <Input required label={t('tasksKris.name')} {...register('name')} error={errors.name?.message} />
                        </GridCol>
                        <GridCol setWidth="one-half">
                            <Input required label={t('tasksKris.description')} {...register('description')} error={errors.description?.message} />
                        </GridCol>
                    </GridRow>
                    <GridRow>
                        <GridCol setWidth="one-half">
                            <Input required type="date" label={t('tasksKris.deadline')} {...register('deadline')} error={errors.deadline?.message} />
                        </GridCol>
                        <GridCol setWidth="one-half">
                            <IdentitySelect
                                key={seed}
                                name="user"
                                required
                                label={t('tasksKris.user')}
                                setValue={setValue}
                                register={register}
                                error={errors.user?.message}
                                defaultValue={defaultValue}
                            />
                        </GridCol>
                    </GridRow>
                    <ButtonGroupRow>
                        <Button type="submit" label={t('tasksKris.save')} />
                        <Button
                            variant="secondary"
                            label={t('tasksKris.cancel')}
                            onClick={() => {
                                reset()
                                setShowForm(false)
                            }}
                        />
                    </ButtonGroupRow>
                </form>
            ) : (
                <Button label={t('tasksKris.createTask')} onClick={() => setShowForm(true)} />
            )}

            <TasksListView
                defaultFilterValues={defaultFilterValues}
                filterParams={filterParams}
                isError={isErrorData}
                isIdle={isIdle}
                isLoading={isLoadingData}
                setPagination={setPagination}
                setSort={setSort}
                sort={sort}
                pagination={pagination}
                columns={columns}
                appIds={appIds}
                tasksData={data}
                isWrapped
                hideTypeFilter
            />
        </QueryFeedback>
    )
}
