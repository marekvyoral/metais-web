import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ActionsOverTable } from '@isdd/metais-common/components/actions-over-table/ActionsOverTable'
import { BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { ApiMeetingExternalActor, ApiMeetingRequest } from '@isdd/metais-common/api/generated/standards-swagger'

type MeetingExternalActorsTableProps = {
    data?: void | ApiMeetingRequest | undefined
    handleFilterChange?: (filter: IFilter) => void
    pagination?: Pagination
    error?: boolean
    isLoading?: boolean
}

export const MeetingExternalActorsTable = ({ data, error, isLoading }: MeetingExternalActorsTableProps) => {
    const { t } = useTranslation()

    const [pageSize, setPageSize] = useState<number>(BASE_PAGE_SIZE)
    const [currentPage, setCurrentPage] = useState(1)
    const startOfList = currentPage * pageSize - pageSize
    const endOfList = currentPage * pageSize
    const handlePagingSelect = (value: string) => {
        setPageSize(Number(value))
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
                pagination={{ pageNumber: currentPage, pageSize, dataLength: data?.meetingExternalActors?.length ?? 0 }}
                handlePagingSelect={handlePagingSelect}
                entityName={''}
                hiddenButtons={{ SELECT_COLUMNS: true }}
            />
            <Table data={data?.meetingExternalActors?.slice(startOfList, endOfList)} columns={columns} isLoading={isLoading} error={error} />
            <PaginatorWrapper
                pageSize={pageSize}
                pageNumber={currentPage}
                dataLength={data?.meetingExternalActors?.length ?? 0}
                handlePageChange={(page) => setCurrentPage(page.pageNumber ?? -1)}
            />
        </div>
    )
}
