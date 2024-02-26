import { DateInput } from '@isdd/idsk-ui-kit/date-input/DateInput'
import { Filter, GridCol, GridRow, PaginatorWrapper, SimpleSelect, Table } from '@isdd/idsk-ui-kit/index'
import { IFilter } from '@isdd/idsk-ui-kit/types/filter'
import { Group } from '@isdd/metais-common/api/generated/iam-swagger'
import { ApiMeetingRequestPreview } from '@isdd/metais-common/api/generated/standards-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, Subject } from '@isdd/metais-common/hooks/permissions/useMeetingsListPermissions'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ActionsOverTable, CreateEntityButton, MutationFeedback, formatDateTimeForDefaultValue } from '@isdd/metais-common/index'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
export enum SortType {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum MeetingStateEnum {
    PAST = 'PAST',
    CANCELED = 'CANCELED',
    FUTURE = 'FUTURE',
    SUMMARIZED = 'SUMMARIZED',
    NOW = 'NOW',
}

export interface MeetingsFilterData extends IFilterParams, IFilter {
    meetingOption?: string
    group?: string
    state?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    ascending?: boolean
}
interface IMeetingsListView {
    meetings: ApiMeetingRequestPreview[] | undefined
    groups: Group[] | undefined
    meetingsCount: number
    defaultFilterValues: MeetingsFilterData
    filter: MeetingsFilterData
    handleFilterChange: (changedFilter: IFilter) => void
}

export enum MeetingFilter {
    MY_MEETINGS = 'my',
    ALL_MEETINGS = 'all',
}
export const MeetingsListView: React.FC<IMeetingsListView> = ({
    meetings,
    groups,
    meetingsCount,
    defaultFilterValues,
    filter,
    handleFilterChange,
}) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { isActionSuccess } = useActionSuccess()

    const [meetingOption, setMeetingOption] = useState(defaultFilterValues.meetingOption)
    const [group, setGroup] = useState<string | null | undefined>(defaultFilterValues.group)
    const [state, setState] = useState<string | null | undefined>(defaultFilterValues.state)

    useEffect(() => {
        setMeetingOption(filter.meetingOption)
        setGroup(filter.group || null)
        setState(filter.state || null)
    }, [filter.group, filter.meetingOption, filter.state])

    const columns: Array<ColumnDef<ApiMeetingRequestPreview>> = [
        {
            header: t('meetings.name'),
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: 'name',
            meta: {
                getCellContext: (ctx: CellContext<ApiMeetingRequestPreview, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) => (
                <Link to={`${ctx?.row?.original?.id}`} state={{ from: location }}>
                    {ctx?.getValue?.() as string}
                </Link>
            ),
            size: 200,
        },
        {
            header: t('meetings.groupShortName'),
            accessorFn: (row) => {
                const meetingGroup = groups?.find((o) => row.groups?.includes(o.uuid || ''))
                return meetingGroup?.shortName || ''
            },
            enableSorting: false,
            id: 'groupShortName',
            meta: {
                getCellContext: (ctx: CellContext<ApiMeetingRequestPreview, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,

            size: 200,
        },
        {
            header: t('meetings.groupName'),
            accessorFn: (row) => {
                const meetingGroup = groups?.find((o) => row.groups?.includes(o.uuid || ''))
                return meetingGroup?.name || ''
            },
            enableSorting: false,
            id: 'groupName',
            meta: {
                getCellContext: (ctx: CellContext<ApiMeetingRequestPreview, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
            size: 200,
        },
        {
            header: t('meetings.beginDate'),
            accessorFn: (row) => row?.beginDate,
            enableSorting: true,
            id: 'beginDate',
            meta: {
                getCellContext: (ctx: CellContext<ApiMeetingRequestPreview, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) => formatDateTimeForDefaultValue(ctx.getValue() as string, 'dd.MM.yyyy, HH:mm'),
            size: 200,
        },
        {
            header: t('meetings.state'),
            accessorFn: (row) => row?.state,
            enableSorting: true,
            id: 'state',
            meta: {
                getCellContext: (ctx: CellContext<ApiMeetingRequestPreview, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{t(`meetings.stateValue.${ctx.row?.original?.state}`)}</span>,
            size: 200,
        },
    ]

    return (
        <>
            <MutationFeedback success={isActionSuccess.value} error={false} successMessage={t('feedback.mutationCreateSuccessMessage')} />
            <Filter<MeetingsFilterData>
                onlyForm
                defaultFilterValues={defaultFilterValues}
                form={({ setValue, register, control }) => {
                    return (
                        <div>
                            <SimpleSelect
                                label={t('meetings.filter.meetingOption')}
                                name="meetingOption"
                                id="meetingOption"
                                options={[
                                    { value: MeetingFilter.ALL_MEETINGS, label: t('meetings.filter.meetingOptionValue.all') }, //all
                                    { value: MeetingFilter.MY_MEETINGS, label: t('meetings.filter.meetingOptionValue.my') }, //my
                                ]}
                                value={meetingOption}
                                onChange={(val) => {
                                    setMeetingOption(val)
                                }}
                                setValue={setValue}
                            />
                            <SimpleSelect
                                label={t('meetings.filter.group')}
                                name="group"
                                id="group"
                                options={groups?.map((item) => ({ value: item.uuid ?? '', label: `${item.shortName} - ${item.name}` ?? '' })) ?? []}
                                value={group}
                                onChange={(val) => {
                                    setGroup(val)
                                }}
                                setValue={setValue}
                            />
                            <SimpleSelect
                                label={t('meetings.filter.state')}
                                name="state"
                                id="state"
                                options={[
                                    { value: MeetingStateEnum.CANCELED, label: t(`meetings.stateValue.${MeetingStateEnum.CANCELED}`) },
                                    { value: MeetingStateEnum.FUTURE, label: t(`meetings.stateValue.${MeetingStateEnum.FUTURE}`) },
                                    { value: MeetingStateEnum.NOW, label: t(`meetings.stateValue.${MeetingStateEnum.NOW}`) },
                                    { value: MeetingStateEnum.PAST, label: t(`meetings.stateValue.${MeetingStateEnum.PAST}`) },
                                    { value: MeetingStateEnum.SUMMARIZED, label: t(`meetings.stateValue.${MeetingStateEnum.SUMMARIZED}`) },
                                ]}
                                value={state}
                                onChange={(val) => {
                                    setState(val)
                                }}
                                setValue={setValue}
                            />
                            <GridRow>
                                <GridCol setWidth="one-half">
                                    <DateInput
                                        label={t('meetings.filter.startDate')}
                                        {...register('startDate')}
                                        control={control}
                                        setValue={setValue}
                                    />
                                </GridCol>
                                <GridCol setWidth="one-half">
                                    <DateInput
                                        label={t('meetings.filter.startDate')}
                                        {...register('endDate')}
                                        control={control}
                                        setValue={setValue}
                                    />
                                </GridCol>
                            </GridRow>
                        </div>
                    )
                }}
            />

            <ActionsOverTable
                pagination={{
                    pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
                    pageSize: filter.pageSize ?? BASE_PAGE_SIZE,
                    dataLength: meetings?.length ?? 0,
                }}
                createButton={
                    <Can I={Actions.CREATE} a={Subject.MEETING}>
                        <CreateEntityButton
                            label={t('meetings.addNewMeeting')}
                            onClick={() => navigate(`${NavigationSubRoutes.ZOZNAM_ZASADNUTI_CREATE}`)}
                        />
                    </Can>
                }
                handleFilterChange={handleFilterChange}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                entityName=""
            />

            <Table
                columns={columns}
                data={meetings}
                sort={filter.sort}
                onSortingChange={(columnSort) => {
                    handleFilterChange({ sort: columnSort })
                }}
            />
            <PaginatorWrapper
                pageSize={filter.pageSize ?? BASE_PAGE_SIZE}
                pageNumber={filter.pageNumber ?? BASE_PAGE_NUMBER}
                dataLength={meetingsCount}
                handlePageChange={handleFilterChange}
            />
        </>
    )
}
