import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE, DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { ApiMeetingExternalActor, ApiMeetingRequest } from '@isdd/metais-common/api/generated/standards-swagger'

type MeetingExternalActorsTableProps = {
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
export const MeetingExternalActorsTable = ({ data, error, isLoading }: MeetingExternalActorsTableProps) => {
    const { t } = useTranslation()

    const [pagination, setPagination] = useState(defaultPagination)
    const sortedData = useMemo(
        () =>
            data?.meetingExternalActors?.sort((a, b) => {
                if (a.name && b.name) return a.name.localeCompare(b.name)
                return 0
            }) || [],
        [data?.meetingExternalActors],
    )
    const filteredData = useMemo(() => {
        const startOfList = pagination.pageNumber * pagination.pageSize - pagination.pageSize
        const endOfList = pagination.pageNumber * pagination.pageSize
        return sortedData.slice(startOfList, endOfList) || []
    }, [pagination.pageNumber, pagination.pageSize, sortedData])

    const myHandleFilterChange = (myFilter: IFilter) => {
        setPagination({
            ...pagination,
            pageSize: myFilter.pageSize ?? BASE_PAGE_SIZE,
            pageNumber: myFilter.pageNumber ?? defaultPagination.pageNumber,
        })
    }

    const columns: Array<ColumnDef<ApiMeetingExternalActor>> = [
        {
            header: t('meetings.userName'),
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: 'userName',
            meta: {
                getCellContext: (ctx: CellContext<ApiMeetingExternalActor, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('meetings.email'),
            accessorFn: (row) => row?.email,
            enableSorting: true,
            id: 'email',
            meta: {
                getCellContext: (ctx: CellContext<ApiMeetingExternalActor, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('meetings.description'),
            accessorFn: (row) => row?.description,
            enableSorting: true,
            id: 'description',
            meta: {
                getCellContext: (ctx: CellContext<ApiMeetingExternalActor, unknown>) => ctx?.getValue?.(),
            },
            cell: (ctx) => <span>{ctx?.getValue?.() as string}</span>,
        },
        {
            header: t('meetings.participation'),
            accessorFn: (row) => row?.participation,
            enableSorting: true,
            id: 'participation',
            meta: {
                getCellContext: (ctx: CellContext<ApiMeetingExternalActor, unknown>) => ctx?.getValue?.(),
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
                pagination={{ ...pagination, dataLength: data?.meetingExternalActors?.length ?? 0 }}
                handleFilterChange={myHandleFilterChange}
                entityName={''}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
            />
            <Table<ApiMeetingExternalActor> data={filteredData} columns={columns} isLoading={isLoading} error={error} />
            <PaginatorWrapper
                dataLength={data?.meetingExternalActors?.length ?? 0}
                pageNumber={pagination.pageNumber}
                pageSize={pagination.pageSize}
                handlePageChange={(page) => setPagination({ ...pagination, pageNumber: page.pageNumber ?? defaultPagination.pageNumber })}
            />
        </div>
    )
}
