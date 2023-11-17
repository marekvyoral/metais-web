import { Filter, GridCol, GridRow, Input, PaginatorWrapper, SimpleSelect, Table } from '@isdd/idsk-ui-kit/index'
import { IFilter } from '@isdd/idsk-ui-kit/types/filter'
import { Group } from '@isdd/metais-common/api/generated/iam-swagger'
import { ApiMeetingRequestPreview, GetMeetingRequestsParams } from '@isdd/metais-common/api/generated/standards-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { useActionSuccess } from '@isdd/metais-common/contexts/actionSuccess/actionSuccessContext'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ActionsOverTable, CreateEntityButton, MutationFeedback, QueryFeedback, formatDateTimeForDefaultValue } from '@isdd/metais-common/index'
import { NavigationSubRoutes } from '@isdd/metais-common/navigation/routeNames'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'

interface IMeetingsListView {
    meetings: ApiMeetingRequestPreview[] | undefined
    isLoading: boolean
    isError: boolean
    groups: Group[] | undefined
    setMeetingsRequestParams: Dispatch<SetStateAction<GetMeetingRequestsParams>>
    meetingsCount: number
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
}
export enum MeetingFilter {
    MY_MEETINGS = 'my',
    ALL_MEETINGS = 'all',
}
export const MeetingsListView: React.FC<IMeetingsListView> = ({ meetings, isLoading, isError, groups, setMeetingsRequestParams, meetingsCount }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { isActionSuccess } = useActionSuccess()

    const {
        state: { user },
    } = useAuth()
    const userIsRoles = user?.roles.includes('STD_KSPODP' || 'STD_KSPRE' || 'STD_KSTAJ' || 'STD_PSPRE' || 'STD_PSPODP')
    const defaultFilterValues: MeetingsFilterData = {
        meetingOption: MeetingFilter.MY_MEETINGS,
        group: '',
        state: '',
        startDate: '',
        endDate: '',
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
    }
    const [meetingOption, setMeetingOption] = useState(defaultFilterValues.meetingOption)
    const [group, setGroup] = useState<string | null | undefined>(defaultFilterValues.group)
    const [state, setState] = useState<string | null | undefined>(defaultFilterValues.state)

    const { filter, handleFilterChange } = useFilterParams<MeetingsFilterData>(defaultFilterValues)
    useEffect(() => {
        setMeetingsRequestParams((prev) => {
            const newParams = { ...prev, pageNumber: Number(filter.pageNumber), perPage: Number(filter.pageSize) }
            if (filter.meetingOption !== MeetingFilter.MY_MEETINGS) delete newParams.onlyMy
            if (!filter.state) delete newParams.state
            if (!filter.group) delete newParams.workGroupId
            if (!filter.startDate) delete newParams.fromDate
            if (!filter.endDate) delete newParams.toDate
            setMeetingOption(filter.meetingOption)
            setGroup(filter.group || null)
            setState(filter.state || null)
            return {
                ...newParams,
                ...(filter?.meetingOption == MeetingFilter.MY_MEETINGS && { onlyMy: true }),
                ...(filter?.group && { workGroupId: filter?.group }),
                ...(filter?.state && { state: filter?.state }),
                ...(filter?.startDate && { fromDate: filter?.startDate }),
                ...(filter?.endDate && { toDate: filter?.endDate }),
            }
        })
    }, [
        filter?.endDate,
        filter?.group,
        filter?.meetingOption,
        filter?.startDate,
        filter?.state,
        filter?.pageNumber,
        filter?.pageSize,
        setMeetingsRequestParams,
    ])

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
        },
        {
            header: t('meetings.groupShortName'),
            accessorFn: (row) => {
                const meetingGroup = groups?.find((o) => row.groups?.includes(o.uuid || ''))
                return meetingGroup?.shortName || ''
            },
            enableSorting: true,
            id: 'groupShortName',
            meta: {
                getCellContext: (ctx: CellContext<ApiMeetingRequestPreview, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('meetings.groupName'),
            accessorFn: (row) => {
                const meetingGroup = groups?.find((o) => row.groups?.includes(o.uuid || ''))
                return meetingGroup?.name || ''
            },
            enableSorting: true,
            id: 'groupName',
            meta: {
                getCellContext: (ctx: CellContext<ApiMeetingRequestPreview, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
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
        },
    ]

    return (
        <>
            <MutationFeedback success={isActionSuccess.value} error={false} successMessage={t('feedback.mutationCreateSuccessMessage')} />
            <Filter<MeetingsFilterData>
                onlyForm
                defaultFilterValues={defaultFilterValues}
                form={({ setValue, register }) => {
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
                                    <Input label={t('meetings.filter.startDate')} type="date" {...register('startDate')} />
                                </GridCol>
                                <GridCol setWidth="one-half">
                                    <Input label={t('meetings.filter.endDate')} type="date" {...register('endDate')} />
                                </GridCol>
                            </GridRow>
                        </div>
                    )
                }}
            />
            {userIsRoles && (
                <ActionsOverTable
                    pagination={{
                        pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
                        pageSize: filter.pageSize ?? BASE_PAGE_SIZE,
                        dataLength: meetings?.length ?? 0,
                    }}
                    createButton={
                        <CreateEntityButton
                            label={t('meetings.addNewMeeting')}
                            onClick={() => navigate(`${NavigationSubRoutes.ZOZNAM_ZASADNUTI_CREATE}`)}
                        />
                    }
                    handleFilterChange={handleFilterChange}
                    hiddenButtons={{ SELECT_COLUMNS: true }}
                    pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                    entityName=""
                />
            )}
            <QueryFeedback loading={isLoading} error={isError} withChildren>
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
            </QueryFeedback>
        </>
    )
}
