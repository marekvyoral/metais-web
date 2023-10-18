import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    ApiCodelistItem,
    ApiCodelistItemList,
    ApiCodelistItemName,
    ApiCodelistItemValidity,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { ColumnDef, ExpandedState, Row } from '@tanstack/react-table'
import { Table, CheckBox, ExpandableRowCellWrapper } from '@isdd/idsk-ui-kit/index'
import { AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

import { isEffective, selectBasedOnLanguageAndDate } from './CodeListDetailUtils'
import { CodeListDetailItemsTableExpandedRow } from './CodeListDetailItemsTableExpandedRow'

export interface TableCols extends ApiCodelistItem {
    selected?: boolean
}
export interface CodeListDetailItemsTableProps {
    items: ApiCodelistItemList
    attributeProfile?: AttributeProfile
    rowSelection: Record<string, TableCols>
    setRowSelection: (item: Record<string, TableCols>) => void
    filter: IFilter
    workingLanguage: string
    handleFilterChange: (filter: IFilter) => void
    handleMarkForPublish: (ids: number[]) => void
}

export enum CodeListItemState {
    NEW = 'NEW',
    READY_TO_PUBLISH = 'READY_TO_PUBLISH',
    PUBLISHED = 'PUBLISHED',
    UPDATING = 'UPDATING',
}

function reduceRowsToObject(rows: ApiCodelistItem[]) {
    return rows.reduce<Record<string, ApiCodelistItem>>((result, item) => {
        if (item.id) {
            result[item.id] = item
        }
        return result
    }, {})
}

export const CodeListDetailItemsTable: React.FC<CodeListDetailItemsTableProps> = ({
    items,
    attributeProfile,
    rowSelection,
    setRowSelection,
    filter,
    workingLanguage,
    handleFilterChange,
    handleMarkForPublish,
}) => {
    const { t } = useTranslation()
    const [expandedState, setExpandedState] = useState<ExpandedState>({})

    const {
        state: { user },
    } = useAuth()

    const isLoggedIn = !!user

    const handleAllCheckboxChange = useCallback(
        (rows: ApiCodelistItem[]) => {
            const rowsWithoutDisabled = rows.filter(
                (row) => row.codelistItemState !== CodeListItemState.PUBLISHED && row.codelistItemState !== CodeListItemState.READY_TO_PUBLISH,
            )
            const checked = rowsWithoutDisabled.every(({ id }) => (id ? !!rowSelection[id] : false))
            if (checked) {
                setRowSelection({})
            } else {
                setRowSelection(reduceRowsToObject(rowsWithoutDisabled))
            }
        },
        [rowSelection, setRowSelection],
    )

    const handleCheckboxChange = useCallback(
        (row: Row<ApiCodelistItem>) => {
            if (!row.original.id) return
            const { id } = row.original
            const newRowSelection = { ...rowSelection }
            if (rowSelection[id]) {
                delete newRowSelection[id]
            } else {
                newRowSelection[id] = row.original
            }
            setRowSelection(newRowSelection)
        },
        [rowSelection, setRowSelection],
    )

    const clearSelectedRows = useCallback(() => setRowSelection({}), [setRowSelection])

    const isRowSelected = useCallback(
        (row: Row<ApiCodelistItem>) => {
            return row.original.id ? !!rowSelection[row.original.id] : false
        },
        [rowSelection],
    )

    const columns: Array<ColumnDef<ApiCodelistItem>> = []

    if (isLoggedIn) {
        columns.push(
            {
                id: 'checkbox',
                header: ({ table }) => {
                    const rowsWithoutDisabled = table
                        .getRowModel()
                        .rows.filter(
                            (row) =>
                                row.original.codelistItemState !== CodeListItemState.PUBLISHED &&
                                row.original.codelistItemState !== CodeListItemState.READY_TO_PUBLISH,
                        )
                    const checked =
                        rowsWithoutDisabled.length > 0 &&
                        rowsWithoutDisabled.every((row) => (row.original.id ? !!rowSelection[row.original.id] : false))
                    return (
                        <div className="govuk-checkboxes govuk-checkboxes--small">
                            <CheckBox
                                label=""
                                name="checkbox"
                                id="checkbox-all"
                                onChange={() => handleAllCheckboxChange(items.codelistsItems || [])}
                                disabled={rowsWithoutDisabled.length === 0}
                                checked={checked}
                            />
                        </div>
                    )
                },
                cell: ({ row }) => (
                    <ExpandableRowCellWrapper row={row}>
                        <div className="govuk-checkboxes govuk-checkboxes--small">
                            <CheckBox
                                label=""
                                name="checkbox"
                                id={`checkbox_${row.id}`}
                                value="true"
                                onChange={() => handleCheckboxChange(row)}
                                checked={row.original.id ? !!rowSelection[row.original.id] : false}
                                disabled={
                                    row.original.codelistItemState === CodeListItemState.PUBLISHED ||
                                    row.original.codelistItemState === CodeListItemState.READY_TO_PUBLISH
                                }
                            />
                        </div>
                    </ExpandableRowCellWrapper>
                ),
            },
            {
                id: 'itemCode',
                header: t('codeListDetail.table.code'),
                accessorFn: (row) => row.itemCode,
                enableSorting: true,
            },
        )
    } else {
        columns.push({
            id: 'itemCode',
            header: t('codeListDetail.table.code'),
            accessorFn: (row) => row.itemCode,
            enableSorting: true,
            cell: ({ row }) => <ExpandableRowCellWrapper row={row}>{row.original.itemCode}</ExpandableRowCellWrapper>,
        })
    }

    columns.push({
        id: 'codelistNames',
        header: t('codeListDetail.table.name'),
        accessorFn: (row) => row.codelistItemNames,
        enableSorting: true,
        meta: {
            getCellContext: (ctx) => selectBasedOnLanguageAndDate(ctx.getValue() as ApiCodelistItemName[], workingLanguage),
        },
        cell: (row) => selectBasedOnLanguageAndDate(row.getValue() as ApiCodelistItemName[], workingLanguage),
    })

    if (isLoggedIn) {
        columns.push(
            {
                id: 'state',
                header: t('codeListDetail.table.state'),
                accessorFn: (row) => t(`codeListDetail.state.${row.codelistItemState}`),
            },
            {
                id: 'readyForPublish',
                header: t('codeListDetail.table.readyToPublish'),
                accessorFn: (row) => row.codelistItemState,
                cell: (row) => (row.getValue() === 'READY_TO_PUBLISH' ? t('radioButton.yes') : t('radioButton.no')),
            },
            {
                id: 'effective',
                header: t('codeListDetail.table.effective'),
                accessorFn: (row) => row.codelistItemValidities,
                cell: (row) => {
                    return isEffective(row.getValue() as ApiCodelistItemValidity[]) ? t('radioButton.yes') : t('radioButton.no')
                },
            },
        )
    }

    return (
        <Table
            data={items?.codelistsItems}
            columns={columns}
            sort={filter.sort ?? []}
            expandedRowsState={expandedState}
            onExpandedChange={setExpandedState}
            getExpandedRow={(row) => {
                return (
                    <CodeListDetailItemsTableExpandedRow
                        workingLanguage={workingLanguage}
                        codelistItem={items?.codelistsItems?.find((item) => item.id === row.original.id)}
                        attributeProfile={attributeProfile}
                        handleMarkForPublish={handleMarkForPublish}
                    />
                )
            }}
            onSortingChange={(columnSort) => {
                handleFilterChange({ sort: columnSort })
                clearSelectedRows()
            }}
            isRowSelected={isRowSelected}
        />
    )
}
