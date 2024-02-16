import React from 'react'
import { ReportResultObjectResult } from '@isdd/metais-common/api/generated/report-swagger'
import { CellContext } from '@tanstack/react-table'
import { TableWithPagination } from '@isdd/metais-common/components/TableWithPagination/TableWithPagination'

interface IReportTable {
    data?: ReportResultObjectResult
    isLoading: boolean
    isError: boolean
}

export const ReportTable: React.FC<IReportTable> = ({ data, isLoading, isError }) => {
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
                size: 200,
            }
        }) ?? []

    return (
        <>
            {data?.rows && (
                <TableWithPagination
                    tableColumns={columnsFromApi}
                    tableData={data?.rows}
                    hiddenButtons={{ SELECT_COLUMNS: true }}
                    isLoading={isLoading}
                    isError={isError}
                />
            )}
        </>
    )
}
