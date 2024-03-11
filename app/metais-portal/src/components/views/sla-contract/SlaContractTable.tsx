import { PaginatorWrapper, Table } from '@isdd/idsk-ui-kit/index'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { ColumnSort, IFilter } from '@isdd/idsk-ui-kit/types'
import { useTranslation } from 'react-i18next'
import { Languages } from '@isdd/metais-common/localization/languages'
import { Link } from 'react-router-dom'
import { ApiSlaContractRead } from '@isdd/metais-common/api/generated/monitoring-swagger'

import { ISlaContractData } from '@/components/containers/SlaContractListContainer'

type Props = {
    data: ISlaContractData
    handleFilterChange: (changedFilter: IFilter) => void
    sort: ColumnSort[]
}

enum ColumnNames {
    name = 'name',
    validityStartDate = 'validityStartDate',
    validityEndDate = 'validityEndDate',
    phase = 'phase',
    consumerIsvs = 'consumerIsvs',
    providerIsvs = 'providerIsvs',
}

export const SlaContractTable: React.FC<Props> = ({ data, handleFilterChange, sort }) => {
    const { t, i18n } = useTranslation()
    const { slaContractsData, contractPhaseData } = data

    const columns: Array<ColumnDef<ApiSlaContractRead>> = [
        {
            accessorKey: ColumnNames.name,
            header: () => t('slaContracts.columns.name'),
            id: ColumnNames.name,
            size: 200,
            cell: (ctx: CellContext<ApiSlaContractRead, unknown>) => (
                <Link to={`./${ctx.row?.original?.uuid}`} onClick={(e) => e.stopPropagation()}>
                    {ctx.row.original.name}
                </Link>
            ),
            meta: {
                getCellContext: (ctx: CellContext<ApiSlaContractRead, unknown>) => ctx.row.original.name,
            },
            enableSorting: true,
        },
        {
            accessorKey: ColumnNames.validityStartDate,
            header: () => t('slaContracts.columns.validityStartDate'),
            id: ColumnNames.validityStartDate,
            size: 120,
            cell: (ctx: CellContext<ApiSlaContractRead, unknown>) => t('date', { date: ctx.row.original.validityStartDate }),
            meta: {
                getCellContext: (ctx: CellContext<ApiSlaContractRead, unknown>) => t('date', { date: ctx.row.original.validityStartDate }),
            },
            enableSorting: true,
        },
        {
            accessorKey: ColumnNames.validityEndDate,
            header: () => t('slaContracts.columns.validityEndDate'),
            id: ColumnNames.validityEndDate,
            size: 120,
            cell: (ctx: CellContext<ApiSlaContractRead, unknown>) => t('date', { date: ctx.row.original.validityEndDate }),
            meta: {
                getCellContext: (ctx: CellContext<ApiSlaContractRead, unknown>) => t('date', { date: ctx.row.original.validityEndDate }),
            },
            enableSorting: true,
        },
        {
            accessorKey: ColumnNames.phase,
            header: () => t('slaContracts.columns.phase'),
            id: ColumnNames.phase,
            size: 200,
            cell: (ctx: CellContext<ApiSlaContractRead, unknown>) => {
                const contractPhaseEnum = contractPhaseData?.enumItems?.find((item) => item.code === ctx.row.original.phase)
                return i18n.language === Languages.SLOVAK ? contractPhaseEnum?.description : contractPhaseEnum?.engDescription
            },
            meta: {
                getCellContext: (ctx: CellContext<ApiSlaContractRead, unknown>) => {
                    const contractPhaseEnum = contractPhaseData?.enumItems?.find((item) => item.code === ctx.row.original.phase)
                    return i18n.language === Languages.SLOVAK ? contractPhaseEnum?.description : contractPhaseEnum?.engDescription
                },
            },
            enableSorting: true,
        },
        {
            accessorKey: ColumnNames.consumerIsvs,
            header: () => t('slaContracts.columns.consumerIsvs'),
            id: ColumnNames.consumerIsvs,
            size: 200,
            cell: (ctx: CellContext<ApiSlaContractRead, unknown>) => ctx.row.original.consumerIsvs?.name,
            meta: {
                getCellContext: (ctx: CellContext<ApiSlaContractRead, unknown>) => ctx.row.original.consumerIsvs?.name,
            },
            enableSorting: true,
        },
        {
            accessorKey: ColumnNames.providerIsvs,
            header: () => t('slaContracts.columns.providerIsvs'),
            id: ColumnNames.providerIsvs,
            size: 200,
            cell: (ctx: CellContext<ApiSlaContractRead, unknown>) => ctx.row.original.providerIsvs?.name,
            meta: {
                getCellContext: (ctx: CellContext<ApiSlaContractRead, unknown>) => ctx.row.original.providerIsvs?.name,
            },
            enableSorting: true,
        },
    ]

    return (
        <>
            <Table
                columns={columns}
                data={slaContractsData?.results}
                rowHref={(row) => `./${row?.original?.uuid}`}
                onSortingChange={(newSort) => {
                    handleFilterChange({ sort: newSort })
                }}
                sort={sort}
                manualSorting
            />
            <PaginatorWrapper
                pageNumber={slaContractsData?.pagination?.page ?? BASE_PAGE_NUMBER}
                pageSize={slaContractsData?.pagination?.perPage ?? BASE_PAGE_SIZE}
                dataLength={slaContractsData?.pagination?.totalItems ?? 0}
                handlePageChange={handleFilterChange}
            />
        </>
    )
}
