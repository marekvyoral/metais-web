import {
    BreadCrumbs,
    Filter,
    GridCol,
    GridRow,
    HomeIcon,
    Input,
    PaginatorWrapper,
    RadioButton,
    RadioButtonGroup,
    SimpleSelect,
    Table,
    TextHeading,
} from '@isdd/idsk-ui-kit/index'
import { ColumnSort, Pagination } from '@isdd/idsk-ui-kit/types'
import { Task, TaskList } from '@isdd/metais-common/api/generated/tasks-swagger'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { EnumType, QueryFeedback } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import React, { SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { FlexColumnReverseWrapper } from '@isdd/metais-common/components/flex-column-reverse-wrapper/FlexColumnReverseWrapper'
import { RouteNames } from '@isdd/metais-common/navigation/routeNames'

import { MainContentWrapper } from '@/components/MainContentWrapper'

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

interface ITasksListView {
    defaultFilterValues: TasksFilter
    filterParams: TasksFilter
    appIds: EnumType | undefined
    tasksData: TaskList | undefined
    isLoading: boolean
    isError: boolean
    isIdle: boolean
    columns: ColumnDef<Task>[]
    pagination: { pageNumber: number; pageSize: number }
    setPagination: React.Dispatch<SetStateAction<Pagination>>
    sort: ColumnSort[]
    setSort: React.Dispatch<SetStateAction<ColumnSort[]>>
}
export const TasksListView: React.FC<ITasksListView> = ({
    defaultFilterValues,
    filterParams,
    appIds,
    tasksData,
    isLoading,
    isError,
    isIdle,
    columns,
    pagination,
    setPagination,
    sort,
    setSort,
}) => {
    const { t } = useTranslation()

    const getTotalNumberOfTasks = (): number => {
        switch (filterParams.state) {
            case TaskFilterState.ALL:
                return tasksData?.tasksCount ?? 0
            case TaskFilterState.DONE:
                return tasksData?.tasksCountDone ?? 0
            default:
                return tasksData?.tasksCountCreated ?? 0 + (tasksData?.tasksCountInProgress ?? 0)
        }
    }

    return (
        <>
            <BreadCrumbs
                withWidthContainer
                links={[
                    { label: t('tasks.home'), href: '/', icon: HomeIcon },
                    { label: t('tasks.tasks'), href: RouteNames.TASKS },
                ]}
            />
            <MainContentWrapper>
                <FlexColumnReverseWrapper>
                    <TextHeading size="L">{t('tasks.tasks')}</TextHeading>
                    {isError && <QueryFeedback loading={false} error={isError} />}
                </FlexColumnReverseWrapper>
                <Filter<TasksFilter>
                    defaultFilterValues={defaultFilterValues}
                    form={({ register, setValue }) => {
                        return (
                            <div>
                                <SimpleSelect
                                    options={[
                                        { label: t('tasks.all'), value: 'ALL' },
                                        ...(appIds?.enumItems?.map((enumItem) => {
                                            return { value: `${enumItem.value}`, label: t(`tasks.${enumItem.code}`) }
                                        }) ?? [{ value: '', label: '' }]),
                                    ]}
                                    label={t('tasks.selectType')}
                                    id="taskTypeSelect"
                                    name="taskTypeSelect"
                                    setValue={setValue}
                                />
                                <GridRow>
                                    <GridCol setWidth="one-half">
                                        <Input
                                            {...register('createdFrom')}
                                            type="date"
                                            name="createdFrom"
                                            label={t('tasks.createdFrom')}
                                            id="createdFrom"
                                        />
                                    </GridCol>
                                    <GridCol setWidth="one-half">
                                        <Input {...register('createdTo')} type="date" name="createdTo" label={t('tasks.createdTo')} id="createdTo" />
                                    </GridCol>
                                </GridRow>
                                <label className="govuk-label">{t('tasks.state')}:</label>
                                <RadioButtonGroup inline>
                                    <RadioButton
                                        {...register('state')}
                                        value="ALL"
                                        label={`${t('tasks.all')} (${tasksData?.tasksCount ?? 0})`}
                                        id="allRadioBtn"
                                        name="allRadioBtn"
                                        onChange={(val) => setValue('state', val.target.value)}
                                        defaultChecked
                                    />
                                    <RadioButton
                                        {...register('state')}
                                        value="ACTIVE"
                                        label={`${t('tasks.active')} (${
                                            (tasksData?.tasksCountCreated ?? 0) + (tasksData?.tasksCountInProgress ?? 0)
                                        })`}
                                        id="activeRadioBtn"
                                        name="activeRadioBtn"
                                        onChange={(val) => {
                                            setValue('state', val.target.value)
                                        }}
                                    />
                                    <RadioButton
                                        {...register('state')}
                                        value="DONE"
                                        label={`${t('tasks.done')} (${tasksData?.tasksCountDone ?? 0})`}
                                        id="doneRadioBtn"
                                        name="doneRadioBtn"
                                        onChange={(val) => setValue('state', val.target.value)}
                                    />
                                </RadioButtonGroup>
                            </div>
                        )
                    }}
                />

                <QueryFeedback loading={isLoading || isIdle} error={false} withChildren>
                    <Table<Task>
                        columns={columns}
                        isLoading={isLoading}
                        error={isError}
                        data={tasksData?.tasks}
                        sort={sort}
                        onSortingChange={(newSort) => {
                            setSort(newSort)
                        }}
                    />
                </QueryFeedback>
                <PaginatorWrapper
                    pageNumber={pagination.pageNumber}
                    pageSize={pagination.pageSize}
                    dataLength={getTotalNumberOfTasks()}
                    handlePageChange={(filter) => {
                        setPagination({ ...pagination, ...filter, dataLength: getTotalNumberOfTasks() })
                    }}
                />
            </MainContentWrapper>
        </>
    )
}
