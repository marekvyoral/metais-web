import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import React from 'react'
import { QueryFeedback } from '@isdd/metais-common/index'
import { ReportResultObjectResult } from '@isdd/metais-common/api/generated/report-swagger'
import { CellContext } from '@tanstack/react-table'

interface IReportTable {
    data?: ReportResultObjectResult
    isLoading: boolean
    isError: boolean
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
}

export const ReportTable: React.FC<IReportTable> = ({ data, isLoading, isError, pagination, handleFilterChange }) => {
    const columnsFromApi =
        data?.headers?.map((header: { name: string; type: string }, index: number) => {
            return {
                accessorFn: (row: { values: string[] }) => row,
                header: () => header?.name ?? '',
                id: header?.name ?? '',
                meta: {
                    getCellContext: (ctx: CellContext<unknown, { values: string[] }>) => ctx?.getValue?.(),
                },
                cell: (row: CellContext<unknown, { values: string[] }>) => row?.getValue()?.values?.[index],
            }
        }) ?? []

    return (
        <QueryFeedback loading={isLoading} error={isError} indicatorProps={{ layer: 'parent' }}>
            <Table columns={columnsFromApi} data={data?.rows} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </QueryFeedback>
    )
}
