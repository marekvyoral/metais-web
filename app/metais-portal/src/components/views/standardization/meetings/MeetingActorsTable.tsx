import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { ApiMeetingActor, ApiMeetingRequest } from '@isdd/metais-common/api/generated/standards-swagger'

type MeetingActorsTableProps = {
    data?: void | ApiMeetingRequest | undefined
    handleFilterChange?: (filter: IFilter) => void
    pagination?: Pagination
    error?: boolean
    isLoading?: boolean
}
const defaultPagination: Pagination = {
    pageNumber: BASE_PAGE_NUMBER,
    pageSize: BASE_PAGE_SIZE,
    dataLength: 0,
}

export const MeetingActorsTable = ({ data, error, isLoading }: MeetingActorsTableProps) => {
    const { t } = useTranslation()
    const [pagination, setPagination] = useState(defaultPagination)

    const filteredData = useMemo(() => {
        const startOfList = pagination.pageNumber * pagination.pageSize - pagination.pageSize
        const endOfList = pagination.pageNumber * pagination.pageSize
        return data?.meetingActors?.slice(startOfList, endOfList) || []
    }, [data?.meetingActors, pagination.pageNumber, pagination.pageSize])

    const myHandleFilterChange = (myFilter: IFilter) => {
        setPagination({
            ...pagination,
            pageSize: myFilter.pageSize ?? BASE_PAGE_SIZE,
            pageNumber: myFilter.pageNumber ?? defaultPagination.pageNumber,
        })
    }
    const columns: Array<ColumnDef<ApiMeetingActor>> = [
        {
            header: t('meetings.userName'),
            accessorFn: (row) => row?.userName,
            enableSorting: true,
            id: 'userName',
            meta: {
                getCellContext: (ctx: CellContext<ApiMeetingActor, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('meetings.groupShortName'),
            accessorFn: (row) => row?.groupShortName,
            enableSorting: true,
            id: 'groupShortName',
            meta: {
                getCellContext: (ctx: CellContext<ApiMeetingActor, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('meetings.userOrgName'),
            accessorFn: (row) => row?.userOrgName,
            enableSorting: true,
            id: 'userOrgName',
            meta: {
                getCellContext: (ctx: CellContext<ApiMeetingActor, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('meetings.participation'),
            accessorFn: (row) => row?.participation,
            enableSorting: true,
            id: 'participation',
            meta: {
                getCellContext: (ctx: CellContext<ApiMeetingActor, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) =>
                ctx.row?.original?.participation ? (
                    <span>{t(`meetings.participationValue.${ctx.row?.original?.participation}`)}</span>
                ) : (
                    <span>{ctx?.getValue?.() as string}</span>
                ),
        },
    ]
    return (
        <div>
            <ActionsOverTable
                pagination={{ ...pagination, dataLength: data?.meetingActors?.length ?? 0 }}
                entityName={''}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                handleFilterChange={myHandleFilterChange}
            />
            <Table data={filteredData} columns={columns} isLoading={isLoading} error={error} />
            <PaginatorWrapper
                dataLength={data?.meetingActors?.length ?? 0}
                pageNumber={pagination.pageNumber}
                pageSize={pagination.pageSize}
                handlePageChange={(page) => setPagination({ ...pagination, pageNumber: page.pageNumber ?? defaultPagination.pageNumber })}
            />
        </div>
    )
}
