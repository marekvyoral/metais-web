import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ReportHeader } from '@isdd/metais-common/api'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

export interface TableCols extends ReportHeader {
    selected?: boolean
}
interface IReportsTable {
    data?: TableCols[]
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
}

export const ReportsTable: React.FC<IReportsTable> = ({ data, pagination, handleFilterChange }) => {
    const { t } = useTranslation()
    const location = useLocation()
    const columns: Array<ColumnDef<TableCols>> = [
        {
            accessorFn: (row) => row.selected,
            header: () => (
                <>
                    <CheckBox label="" name="header.selected" id="header.selected" value="header.selected" />
                </>
            ),
            id: 'selected',
            cell: (row) => <CheckBox label={row.getValue() as string} name="cell.selected" id="cell.selected" value="cell.selected" />,
        },
        {
            header: t('reports.table.name'),
            cell: (ctx) => (
                <Link to={'./' + ctx.row.original.lookupKey ?? ''} state={{ from: location }} className="govuk-link">
                    {ctx.row.original.name as string}
                </Link>
            ),
        },
        {
            accessorFn: (row) => row?.category?.name,
            header: t('reports.table.category'),
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.description,
            header: t('reports.table.description'),
            cell: (row) => row.getValue() as string,
        },
    ]

    return (
        <>
            <Table columns={columns} data={data} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </>
    )
}
