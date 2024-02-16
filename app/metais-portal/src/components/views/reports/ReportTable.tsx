import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ReportResultObjectResult } from '@isdd/metais-common/api/generated/report-swagger'
import { CellContext } from '@tanstack/react-table'
import React from 'react'

interface IReportTable {
    data?: ReportResultObjectResult
    sort: ColumnSort[]
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
}

interface IRowType {
    values: string[]
}
export const ReportTable: React.FC<IReportTable> = ({ data, pagination, sort, handleFilterChange }) => {
    const columnsFromApi =
        data?.headers?.map((header: { name: string; type: string }, index: number) => {
            return {
                accessorFn: (row: IRowType) => row,
                header: () => header?.name ?? '',
                id: header?.name ?? '',
                cell: (row: CellContext<unknown, IRowType>) => row?.getValue()?.values?.[index],
                size: 200,
                enableSorting: false,
            }
        }) ?? []

    return (
        <>
            <Table
                columns={columnsFromApi}
                data={data?.rows}
                sort={sort}
                onSortingChange={(columnSort) => {
                    handleFilterChange({ sort: columnSort })
                }}
            />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </>
    )
}
