import { PaginatorWrapper, Table } from '@isdd/idsk-ui-kit/index'
import { ColumnSort, IFilter } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { ApiOlaContractData, ApiSlaContractReadList } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type Props = {
    data?: ApiSlaContractReadList
    handleFilterChange: (changedFilter: IFilter) => void
    sort: ColumnSort[]
}

enum ColumnNames {
    name = 'name',
    contractCode = 'contractCode',
    validityStartDate = 'validityStartDate',
    validityEndDate = 'validityEndDate',
    contractorIsvsName = 'contractorIsvsName',
    vendorLock = 'vendorLock',
    administratorIsvs = 'administratorIsvs',
}

export const OlaContractTable: React.FC<Props> = ({ data, handleFilterChange, sort }) => {
    const { t } = useTranslation()

    const columns: Array<ColumnDef<ApiOlaContractData>> = [
        {
            accessorKey: ColumnNames.name,
            header: () => {
                return <span>{t('olaContracts.columns.name')}</span>
            },
            id: ColumnNames.name,
            size: 200,
            cell: (ctx: CellContext<ApiOlaContractData, unknown>) => (
                <Link to={`./${ctx.row?.original?.uuid}`} onClick={(e) => e.stopPropagation()}>
                    {ctx.row.original.name}
                </Link>
            ),
            meta: {
                getCellContext: (ctx: CellContext<ApiOlaContractData, unknown>) => ctx.row.original.name,
            },
            enableSorting: true,
        },
        {
            accessorKey: ColumnNames.contractCode,
            header: () => {
                return <span>{t('olaContracts.columns.contractCode')}</span>
            },
            id: ColumnNames.contractCode,
            size: 200,
            cell: (ctx: CellContext<ApiOlaContractData, unknown>) => ctx.row.original.contractCode,
            meta: {
                getCellContext: (ctx: CellContext<ApiOlaContractData, unknown>) => ctx.row.original.contractCode,
            },
            enableSorting: true,
        },
        {
            accessorKey: ColumnNames.validityStartDate,
            header: () => {
                return <span>{t('olaContracts.columns.validityStartDate')}</span>
            },
            id: ColumnNames.validityStartDate,
            size: 200,
            cell: (ctx: CellContext<ApiOlaContractData, unknown>) => t('date', { date: ctx.row.original.validityStartDate }),
            meta: {
                getCellContext: (ctx: CellContext<ApiOlaContractData, unknown>) => t('date', { date: ctx.row.original.validityStartDate }),
            },
            enableSorting: true,
        },
        {
            accessorKey: ColumnNames.validityEndDate,
            header: () => {
                return <span>{t('olaContracts.columns.validityEndDate')}</span>
            },
            id: ColumnNames.validityEndDate,
            size: 200,
            cell: (ctx: CellContext<ApiOlaContractData, unknown>) =>
                ctx.row.original.validityEndDate && t('date', { date: ctx.row.original.validityEndDate }),
            meta: {
                getCellContext: (ctx: CellContext<ApiOlaContractData, unknown>) => t('date', { date: ctx.row.original.validityEndDate }),
            },
            enableSorting: true,
        },
        {
            accessorKey: ColumnNames.contractorIsvsName,
            header: () => {
                return <span>{t('olaContracts.columns.contractorIsvsName')}</span>
            },
            id: ColumnNames.contractorIsvsName,
            size: 200,
            cell: (ctx: CellContext<ApiOlaContractData, unknown>) => {
                return ctx.row.original.contractorIsvsName
            },
            meta: {
                getCellContext: (ctx: CellContext<ApiOlaContractData, unknown>) => ctx.row.original.contractorIsvsName,
            },
            enableSorting: true,
        },
        {
            accessorKey: ColumnNames.administratorIsvs,
            header: () => {
                return <span>{t('olaContracts.columns.consumerIsvs')}</span>
            },
            id: ColumnNames.administratorIsvs,
            size: 200,
            cell: (ctx: CellContext<ApiOlaContractData, unknown>) => ctx.row.original.administratorIsvs?.map((i) => i.name).join(', '),
            meta: {
                getCellContext: (ctx: CellContext<ApiOlaContractData, unknown>) => ctx.row.original.administratorIsvs?.map((i) => i.name).join(', '),
            },
            enableSorting: true,
        },
        {
            accessorKey: ColumnNames.vendorLock,
            header: () => {
                return <span>{t('olaContracts.columns.vendorLock')}</span>
            },
            id: ColumnNames.vendorLock,
            size: 200,
            cell: (ctx: CellContext<ApiOlaContractData, unknown>) => (ctx.row.original.vendorLock == true ? 'true' : 'false'),
            meta: {
                getCellContext: (ctx: CellContext<ApiOlaContractData, unknown>) => (ctx.row.original.vendorLock == true ? 'true' : 'false'),
            },
            enableSorting: true,
        },
    ]

    return (
        <>
            <Table
                columns={columns}
                data={data?.results}
                rowHref={(row) => `./${row?.original?.uuid}`}
                onSortingChange={(newSort) => {
                    handleFilterChange({ sort: newSort })
                }}
                sort={sort}
                manualSorting
            />
            <PaginatorWrapper
                pageNumber={data?.pagination?.page ?? BASE_PAGE_NUMBER}
                pageSize={data?.pagination?.perPage ?? BASE_PAGE_SIZE}
                dataLength={data?.pagination?.totalItems ?? 0}
                handlePageChange={handleFilterChange}
            />
        </>
    )
}
