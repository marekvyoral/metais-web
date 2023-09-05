import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ReportResultObjectResult } from '@isdd/metais-common/api'
import { CellContext } from '@tanstack/react-table'
import React from 'react'

interface IReportTable {
    data?: ReportResultObjectResult
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
}

interface IRowType {
    values: string[]
}
export const ReportTable: React.FC<IReportTable> = ({ data, pagination, handleFilterChange }) => {
    const columnsFromApi =
        data?.headers?.map((header: { name: string; type: string }, index: number) => {
            return {
                accessorFn: (row: IRowType) => row,
                header: () => header?.name ?? '',
                id: header?.name ?? '',
                cell: (row: CellContext<unknown, IRowType>) => row?.getValue()?.values?.[index],
            }
        }) ?? []

    return (
        <>
            <Table columns={columnsFromApi} data={data?.rows} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </>
    )
}
