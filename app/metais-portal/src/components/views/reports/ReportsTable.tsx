import { TextHeading } from '@isdd/idsk-ui-kit/index'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ReportHeader } from '@isdd/metais-common/api/generated/report-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
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
    const { userInfo: user } = useAuth()
    const isUserLogged = !!user
    const columns: Array<ColumnDef<TableCols>> = [
        {
            header: t('reports.table.name'),
            meta: {
                getCellContext: (ctx) => ctx?.row.original.name,
            },
            cell: (ctx) => (
                <Link to={'./' + ctx.row.original.lookupKey ?? ''} state={{ from: location }} className="govuk-link">
                    {ctx.row.original.name as string}
                </Link>
            ),
        },
        {
            accessorFn: (row) => row?.category?.name,
            header: t('reports.table.category'),
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.description,
            header: t('reports.table.description'),
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (row) => row.getValue() as string,
        },
    ]

    const columnsWithPermissions = isUserLogged ? columns : columns.slice(1)
    return (
        <>
            <TextHeading size="XL">{t('navMenu.reports')}</TextHeading>
            <Table columns={columnsWithPermissions} data={data} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </>
    )
}
