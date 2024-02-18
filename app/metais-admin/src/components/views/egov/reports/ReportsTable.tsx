import { SimpleSelect } from '@isdd/idsk-ui-kit/index'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ReportHeader } from '@isdd/metais-common/api/generated/report-swagger'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ReportsListActionsOverRowEnum } from '@/components/containers/Egov/Reports-management/ReportsUtils'

export interface TableCols extends ReportHeader {
    selected?: boolean
}
interface IReportsTable {
    data?: TableCols[]
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
    handleRowAction: (action: ReportsListActionsOverRowEnum, id: number | undefined, isPublished: boolean, reportDetailLookupString?: string) => void
}

export const ReportsTable: React.FC<IReportsTable> = ({ data, pagination, handleFilterChange, handleRowAction }) => {
    const { t } = useTranslation()
    const columns: Array<ColumnDef<TableCols>> = [
        {
            accessorFn: (row) => row?.lookupKey,
            size: 150,
            header: t('report.table.identificator'),
            id: 'reports.table.identificator',
            cell: (row) => row.getValue() as string,
        },
        {
            header: t('report.table.name'),
            size: 200,
            id: 'reports.table.name',
            cell: (ctx) => (
                <Link to={'./' + ctx.row.original.lookupKey ?? ''} className="govuk-link">
                    {ctx.row.original.name as string}
                </Link>
            ),
        },
        {
            accessorFn: (row) => row?.description,
            size: 200,
            header: t('report.table.description'),
            id: 'reports.table.description',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.category?.name,
            size: 150,
            header: t('report.table.category'),
            id: 'reports.table.category',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.publikovany,
            size: 120,
            header: t('report.table.published'),
            id: 'reports.table.published',
            cell: (row) => (row.getValue() ? t('report.publishedTrue') : t('report.publishedFalse')),
        },
        {
            header: t('report.table.actions'),
            cell: ({
                row: {
                    original: { lookupKey, id, publikovany },
                },
            }) => (
                <SimpleSelect
                    label=""
                    defaultValue=""
                    placeholder={t('report.table.actions')}
                    options={[
                        {
                            label: t('report.table.edit'),
                            value: ReportsListActionsOverRowEnum.EDIT,
                        },
                        {
                            label: publikovany ? t('report.table.unpublish') : t('report.table.publish'),
                            value: ReportsListActionsOverRowEnum.PUBLISH,
                        },
                        {
                            label: t('report.table.remove'),
                            value: ReportsListActionsOverRowEnum.REMOVE,
                        },
                    ]}
                    name="report.table.actions"
                    onChange={(value) => {
                        handleRowAction(value as ReportsListActionsOverRowEnum, id, publikovany ?? false, lookupKey)
                    }}
                />
            ),
            id: 'report.table.actions',
        },
    ]

    return (
        <>
            <Table columns={columns} data={data} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </>
    )
}
