import { PaginatorWrapper, Table } from '@isdd/idsk-ui-kit/index'
import { ColumnSort, Pagination } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { TextConfDiff } from '@isdd/metais-common/api/generated/globalConfig-manager-swagger'
import { DEFAULT_PAGESIZE_OPTIONS } from '@isdd/metais-common/constants'
import { ActionsOverTable } from '@isdd/metais-common/index'
import { ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { getPagination } from '@/componentHelpers/localization'

export enum DiffTableColumnsIDs {
    KEY = 'key',
    VALUE_DB = 'valueDb',
    VALUE_INPUT = 'valueInput',
    DIFFERENCE_OCCURS = 'differenceOccurs',
    INTERCHANGED = 'interchanged',
}

type Props = {
    data: TextConfDiff[]
    sort?: ColumnSort[]
    onSortingChange?: (sort: ColumnSort[]) => void
}

export const DiffLocalizationTable: React.FC<Props> = ({ sort, data, onSortingChange }) => {
    const { t } = useTranslation()
    const [pagination, setPagination] = useState<Pagination>({
        pageNumber: BASE_PAGE_NUMBER,
        pageSize: BASE_PAGE_SIZE,
        dataLength: data?.length,
    })

    const { startOfList, endOfList } = getPagination(pagination.pageNumber, pagination.pageSize, pagination.dataLength)

    useEffect(() => {
        if (data && data.length > 0) {
            setPagination((prev) => ({ ...prev, dataLength: data.length }))
        }
    }, [data])

    const columns: Array<ColumnDef<TextConfDiff>> = [
        {
            id: DiffTableColumnsIDs.KEY,
            header: t('localization.key'),
            accessorFn: (row) => row?.key ?? '',
            cell: (ctx) => {
                return ctx.getValue() ?? ''
            },
            enableSorting: !!sort,
        },
        {
            id: DiffTableColumnsIDs.VALUE_INPUT,
            header: t('localization.valueInput'),
            accessorFn: (row) => row?.valueInput ?? '',
            cell: (ctx) => {
                return ctx.getValue() ?? ''
            },
            enableSorting: !!sort,
        },
        {
            id: DiffTableColumnsIDs.VALUE_DB,
            header: t('localization.valueDb'),
            accessorFn: (row) => row?.valueDb ?? '',
            cell: (ctx) => {
                return ctx.getValue() ?? ''
            },
            enableSorting: !!sort,
        },
        {
            id: DiffTableColumnsIDs.DIFFERENCE_OCCURS,
            header: t('localization.differenceOccurs'),
            accessorFn: (row) => row?.differenceOccurs ?? '',
            cell: (ctx) => {
                return t(`localization.diff.${ctx.getValue()}`)
            },
            enableSorting: !!sort,
        },
        {
            id: DiffTableColumnsIDs.INTERCHANGED,
            header: t('localization.interchanged'),
            accessorFn: (row) => row?.interchanged ?? '',
            cell: (ctx) => {
                return t(`localization.diff.${ctx.getValue()}`)
            },
            enableSorting: !!sort,
        },
    ]
    return (
        <>
            <ActionsOverTable
                entityName=""
                pagination={pagination}
                pagingOptions={DEFAULT_PAGESIZE_OPTIONS}
                hiddenButtons={{ SELECT_COLUMNS: true }}
                handleFilterChange={(filter) => setPagination((prev) => ({ ...prev, pageSize: filter.pageSize ?? BASE_PAGE_NUMBER }))}
            />
            <Table columns={columns} data={data.slice(startOfList, endOfList)} sort={sort} onSortingChange={onSortingChange} />
            <PaginatorWrapper
                pageNumber={pagination.pageNumber}
                pageSize={pagination.pageSize}
                dataLength={pagination.dataLength}
                handlePageChange={(filter) => setPagination((prev) => ({ ...prev, pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER }))}
            />
        </>
    )
}
