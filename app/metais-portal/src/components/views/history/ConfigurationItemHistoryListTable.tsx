import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ColumnDef, Row } from '@tanstack/react-table'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { HistoryVersionUiConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Button } from '@isdd/idsk-ui-kit/index'
import { useLocation, useNavigate } from 'react-router-dom'

import { useGetEntityParamsFromUrl } from '@/componentHelpers/ci'

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
    const navigate = useNavigate()
    const location = useLocation()
    const [selectedColumns, setSelectedColumns] = useState<string[]>([])
    const { entityId, entityName } = useGetEntityParamsFromUrl()
    const additionalColumnsNullSafe = additionalColumns ?? []

    const handleCheckRow = useCallback(
        (checked: boolean, uuid: string) => {
            if (checked && !selectedColumns.includes(uuid)) {
                const newSelectedColumns = [...selectedColumns, uuid]
                setSelectedColumns(newSelectedColumns)
            }

            if (!checked && selectedColumns.includes(uuid)) {
                const newSelectedColumns = selectedColumns.filter((item) => item !== uuid)
                setSelectedColumns(newSelectedColumns)
            }
        },
        [selectedColumns],
    )

    const handleCompareHistory = useCallback(() => {
        if (selectedColumns.length === 1) {
            navigate(`/ci/${entityName}/${entityId}/history/${selectedColumns[0]}`, { state: { from: location } })
        } else {
            navigate(`/ci/${entityName}/${entityId}/history/${selectedColumns[0]}/${selectedColumns[1]}`, { state: { from: location } })
        }
    }, [entityId, entityName, location, navigate, selectedColumns])

    const columns: Array<ColumnDef<TableCols>> = [
        {
            accessorFn: (row) => row.selected,
            header: '',
            id: '0',
            cell: ({ row }: { row: Row<TableCols> }) => (
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox
                        label={row?.original?.item?.owner || ''}
                        name="cell.selected"
                        id="cell.selected"
                        value="cell.selected"
                        checked={row?.original?.versionId ? !!selectedColumns.includes(row?.original?.versionId) : false}
                        onChange={(e) => handleCheckRow(e.target.checked, row?.original?.versionId || '')}
                        disabled={selectedColumns.length >= 2 && !selectedColumns.includes(row?.original?.versionId || '')}
                    />
                </div>
            ),
        },
        {
            accessorFn: (row) => row?.actions,
            header: t('historyTab.table.actions'),
            id: '1',
            cell: (row) => (row.getValue() as string[])?.map((i) => t(`history.ACTIONS.${i as string}`)),
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
        ...additionalColumnsNullSafe,
    ]

    return (
        <QueryFeedback loading={isLoading} error={isError} withChildren>
            <Button
                onClick={handleCompareHistory}
                label={t('historyTab.compareButtonLabel')}
                disabled={selectedColumns.length > 2 || selectedColumns.length === 0}
            />
            <Table columns={columns} data={data} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </QueryFeedback>
    )
}
