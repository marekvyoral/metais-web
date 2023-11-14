import { Filter, GridCol, GridRow, Input, PaginatorWrapper, SimpleSelect, Table } from '@isdd/idsk-ui-kit/index'
import { IFilter } from '@isdd/idsk-ui-kit/types/filter'
import { Group } from '@isdd/metais-common/api/generated/iam-swagger'
import { ApiMeetingRequestPreview, GetMeetingRequestsParams } from '@isdd/metais-common/api/generated/standards-swagger'
import { latiniseString } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ActionsOverTable, CreateEntityButton, QueryFeedback, formatDateTimeForDefaultValue } from '@isdd/metais-common/index'
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

export interface MeetingsFilterData extends IFilterParams {
    meetingOption?: string
    group?: string
    state?: string
    startDate?: string
    endDate?: string
}

export const MeetingsListView: React.FC<IMeetingsListView> = ({ meetings, isLoading, isError, groups, setMeetingsRequestParams, meetingsCount }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const [pageSize, setPageSize] = useState<number>(BASE_PAGE_SIZE)
    const [currentPage, setCurrentPage] = useState(1)
    const defaultFilterValues: MeetingsFilterData = { meetingOption: '', group: '', state: '', startDate: '', endDate: '', fullTextSearch: '' }
    const { filter } = useFilterParams<MeetingsFilterData>(defaultFilterValues)
    const [filteredData, setFilteredData] = useState(meetings)

    useEffect(() => {
        setFilteredData(meetings?.filter((item) => latiniseString(item.name ?? '').includes(latiniseString(filter?.fullTextSearch?.trim() ?? ''))))
    }, [filter?.fullTextSearch, meetings])

    useEffect(() => {
        setMeetingsRequestParams((prev) => ({
            ...prev,
            ...(filter?.meetingOption && { onlyMy: filter?.meetingOption == 'my' }),
            ...(filter?.group && { workGroupId: filter?.group }),
            ...(filter?.state && { state: filter?.state }),
            ...(filter?.startDate && { fromDate: filter?.startDate }),
            ...(filter?.endDate && { toDate: filter?.endDate }),
        }))
    }, [filter?.endDate, filter?.group, filter?.meetingOption, filter?.startDate, filter?.state, setMeetingsRequestParams])

    const handlePagingSelect = (value: string) => {
        setPageSize(Number(value))
        setMeetingsRequestParams((prev) => ({ ...prev, perPage: Number(value) }))
    }

    const handlePageNumber = (page: IFilter) => {
        setCurrentPage(page.pageNumber ?? -1)
        setMeetingsRequestParams((prev) => ({ ...prev, pageNumber: Number(page.pageNumber) }))
    }

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
        <QueryFeedback loading={isLoading} error={isError}>
            <Filter
                defaultFilterValues={defaultFilterValues}
                form={({ setValue, register }) => (
                    <div>
                        <SimpleSelect
                            label={t('meetings.filter.meetingOption')}
                            name="meetingOption"
                            id="meetingOption"
                            options={[
                                { value: 'false', label: t('meetings.filter.meetingOptionValue.all') }, //false
                                { value: 'my', label: t('meetings.filter.meetingOptionValue.my') }, //true
                            ]}
                            setValue={setValue}
                            defaultValue={filter?.meetingOption}
                        />
                        <SimpleSelect
                            label={t('meetings.filter.group')}
                            name="group"
                            id="group"
                            options={groups?.map((group) => ({ value: group.uuid ?? '', label: `${group.shortName} - ${group.name}` ?? '' })) ?? []}
                            setValue={setValue}
                            defaultValue={filter?.group || defaultFilterValues.group}
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
                            setValue={setValue}
                            defaultValue={filter?.state}
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
                )}
            />
            <ActionsOverTable
                pagination={{ pageNumber: currentPage, pageSize, dataLength: meetingsCount ?? 0 }}
                createButton={
                    <CreateEntityButton
                        label={t('meetings.addNewMeeting')}
                        onClick={() => navigate(`${NavigationSubRoutes.ZOZNAM_ZASADNUTI_CREATE}`)}
                    />
                }
                handlePagingSelect={handlePagingSelect}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                entityName=""
            />
            <Table columns={columns} data={filteredData} />
            <PaginatorWrapper pageSize={pageSize} pageNumber={currentPage} dataLength={meetingsCount ?? 0} handlePageChange={handlePageNumber} />
        </QueryFeedback>
    )
}
