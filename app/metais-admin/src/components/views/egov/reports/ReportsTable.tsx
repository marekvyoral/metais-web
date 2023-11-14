import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ReportHeader } from '@isdd/metais-common/api/generated/report-swagger'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

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
    const columns: Array<ColumnDef<TableCols>> = [
        {
            accessorFn: (row) => row?.lookupKey,
            header: t('report.table.identificator'),
            id: 'reports.table.identificator',
            cell: (row) => row.getValue() as string,
        },
        {
            header: t('report.table.name'),
            id: 'reports.table.name',
            cell: (ctx) => (
                <Link to={'./' + ctx.row.original.lookupKey ?? ''} className="govuk-link">
                    {ctx.row.original.name as string}
                </Link>
            ),
        },
        {
            accessorFn: (row) => row?.description,
            header: t('report.table.description'),
            id: 'reports.table.description',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.category?.name,
            header: t('report.table.category'),
            id: 'reports.table.category',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.publikovany,
            header: t('report.table.published'),
            id: 'reports.table.published',
            cell: (row) => (row.getValue() ? t('report.publishedTrue') : t('report.publishedFalse')),
        },
        {
            accessorFn: (row) => row?.description,
            header: t('report.table.actions'),
            id: 'reports.table.action',
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
