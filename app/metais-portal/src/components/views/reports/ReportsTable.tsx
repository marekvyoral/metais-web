import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ReportHeader } from '@isdd/metais-common/api/generated/report-swagger'
import { QueryFeedback } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

export interface TableCols extends ReportHeader {
    selected?: boolean
}
interface IReportsTable {
    data?: TableCols[]
    filter: IFilter
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    isFetching?: boolean
}

export const ReportsTable: React.FC<IReportsTable> = ({ data, filter, pagination, handleFilterChange, isFetching }) => {
    const { t } = useTranslation()
    const location = useLocation()
    const columns: Array<ColumnDef<TableCols>> = [
        {
            accessorFn: (row) => row?.name,
            header: t('reports.table.name'),
            id: 'name',
            meta: {
                getCellContext: (ctx) => ctx?.row.original.name,
            },
            cell: (ctx) => (
                <Link to={'./' + encodeURIComponent(ctx.row.original.lookupKey ?? '')} state={{ from: location }} className="govuk-link">
                    {ctx.row.original.name as string}
                </Link>
            ),
            enableSorting: true,
            size: 200,
        },
        {
            accessorFn: (row) => row?.category?.name,
            id: 'category',
            header: t('reports.table.category'),
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (row) => row.getValue() as string,
            enableSorting: true,
            size: 200,
        },
        {
            accessorFn: (row) => row?.description,
            header: t('reports.table.description'),
            id: 'description',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (row) => row.getValue() as string,
            enableSorting: true,
            size: 200,
        },
    ]

    return (
        <>
            <TextHeading size="XL">{t('navMenu.reports')}</TextHeading>
            <QueryFeedback loading={!!isFetching} error={false} withChildren>
                <Table
                    columns={columns}
                    data={data}
                    sort={filter.sort ?? []}
                    onSortingChange={(columnSort) => {
                        handleFilterChange({ sort: columnSort })
                    }}
                />
                <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
            </QueryFeedback>
        </>
    )
}
