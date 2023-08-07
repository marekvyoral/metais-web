import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { HistoryVersionUiConfigurationItemUi, QueryFeedback } from '@isdd/metais-common/index'

export interface TableCols extends HistoryVersionUiConfigurationItemUi {
    selected?: boolean
}
interface ConfigurationItemHistoryListTable {
    data?: TableCols[]
    isLoading: boolean
    isError: boolean
    additionalColumns?: Array<ColumnDef<TableCols>>
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
}

export const ConfigurationItemHistoryListTable: React.FC<ConfigurationItemHistoryListTable> = ({
    data,
    additionalColumns,
    isLoading,
    isError,
    pagination,
    handleFilterChange,
}) => {
    const { t } = useTranslation()

    const additionalColumnsNullsafe = additionalColumns ?? []
    const columns: Array<ColumnDef<TableCols>> = [
        {
            accessorFn: (row) => row.selected,
            header: () => <CheckBox label="" name="header.selected" id="header.selected" value="header.selected" />,
            id: '0',
            cell: (row) => <CheckBox label={row.getValue() as string} name="cell.selected" id="cell.selected" value="cell.selected" />,
        },
        {
            accessorFn: (row) => row?.actions,
            header: t('historyTab.table.actions'),
            id: '1',
            cell: (row) => t(`history.ACTIONS.${row.getValue() as string}`),
        },
        {
            accessorFn: (row) => row?.actionTime,
            header: t('historyTab.table.actionTime'),
            id: '2',
            cell: (row) => new Date(row.getValue() as string).toLocaleString(),
        },
        {
            accessorFn: (row) => row?.actionBy,
            header: t('historyTab.table.actionBy'),
            id: '3',
            cell: (row) => row.getValue() as string,
        },
        ...additionalColumnsNullsafe,
    ]

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <Table columns={columns} data={data} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </QueryFeedback>
    )
}
