import { PaginatorWrapper, Table } from '@isdd/idsk-ui-kit/index'
import { ColumnSort, IFilter } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { EnumItem } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { ApiOlaContractData, ApiSlaContractReadList } from '@isdd/metais-common/api/generated/monitoring-swagger'
import { Languages } from '@isdd/metais-common/localization/languages'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

type Props = {
    data?: ApiSlaContractReadList
    handleFilterChange: (changedFilter: IFilter) => void
    sort: ColumnSort[]
    statesEnum?: EnumItem[]
}

enum ColumnNames {
    name = 'name',
    contractCode = 'contractCode',
    validityStartDate = 'validityStartDate',
    validityEndDate = 'validityEndDate',
    contractorIsvsName = 'contractorIsvsName',
    vendorLock = 'vendorLock',
    administratorIsvs = 'administratorIsvs',
    profilState = 'profilState',
}

export const OlaContractTable: React.FC<Props> = ({ data, handleFilterChange, sort, statesEnum }) => {
    const { t, i18n } = useTranslation()
    const tableRef = useRef<HTMLTableElement>(null)

    const columns: Array<ColumnDef<ApiOlaContractData>> = [
        {
            accessorKey: ColumnNames.name,
            header: t('olaContracts.columns.name'),
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
            header: () => t('olaContracts.columns.contractCode'),
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
            header: () => t('olaContracts.columns.validityStartDate'),
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
            header: t('olaContracts.columns.validityEndDate'),
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
            accessorKey: ColumnNames.profilState,
            header: () => {
                return <span>{t('olaContracts.columns.state')}</span>
            },
            id: ColumnNames.profilState,
            size: 200,
            cell: (ctx: CellContext<ApiOlaContractData, unknown>) =>
                ctx.row.original.profilState &&
                (i18n.language == Languages.SLOVAK
                    ? statesEnum?.find((e) => e.code == ctx.row.original.profilState)?.value
                    : statesEnum?.find((e) => e.code == ctx.row.original.profilState)?.engValue),
            meta: {
                getCellContext: (ctx: CellContext<ApiOlaContractData, unknown>) => ctx.row.original.profilState,
            },
            enableSorting: true,
        },
        {
            accessorKey: ColumnNames.contractorIsvsName,
            header: () => t('olaContracts.columns.contractorIsvsName'),
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
            header: () => t('olaContracts.columns.consumerIsvs'),
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
            header: t('olaContracts.columns.vendorLock'),
            id: ColumnNames.vendorLock,
            size: 200,
            cell: (ctx: CellContext<ApiOlaContractData, unknown>) =>
                ctx.row.original.vendorLock == true ? t('radioButton.yes') : t('radioButton.no'),
            meta: {
                getCellContext: (ctx: CellContext<ApiOlaContractData, unknown>) =>
                    ctx.row.original.vendorLock == true ? t('radioButton.yes') : t('radioButton.no'),
            },
            enableSorting: true,
        },
    ]

    return (
        <>
            <Table
                tableRef={tableRef}
                columns={columns}
                data={data?.results}
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
                handlePageChange={(filter) => {
                    handleFilterChange(filter)
                    tableRef.current?.scrollIntoView({ behavior: 'smooth' })
                }}
            />
        </>
    )
}
