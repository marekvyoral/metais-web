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
import { useAbilityContext } from '@isdd/metais-common/hooks/permissions/useAbilityContext'
import { Actions, Subjects } from '@isdd/metais-common/hooks/permissions/useCodeListPermissions'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'

import { isEffective, selectBasedOnLanguageAndDate } from './CodeListDetailUtils'
import { CodeListDetailItemsTableExpandedRow } from './CodeListDetailItemsTableExpandedRow'

import { CodeListItemState } from '@/componentHelpers/codeList'

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
    handleOpenEditItem: (item: ApiCodelistItem) => void
    handleFilterChange: (filter: IFilter) => void
    handleMarkForPublish: (itemCodes: string[]) => void
}

function reduceRowsToObject(rows: ApiCodelistItem[]) {
    return rows.reduce<Record<string, ApiCodelistItem>>((result, item) => {
        if (item.itemCode) {
            result[item.itemCode] = item
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
    handleOpenEditItem,
    handleFilterChange,
    handleMarkForPublish,
}) => {
    const { t } = useTranslation()
    const [expandedState, setExpandedState] = useState<ExpandedState>({})

    const ability = useAbilityContext()

    const handleAllCheckboxChange = useCallback(
        (rows: ApiCodelistItem[]) => {
            const rowsWithoutDisabled = rows.filter(
                (row) => row.codelistItemState !== CodeListItemState.PUBLISHED && row.codelistItemState !== CodeListItemState.READY_TO_PUBLISH,
            )
            const checked = rowsWithoutDisabled.every(({ itemCode }) => (itemCode ? !!rowSelection[itemCode] : false))
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
            if (!row.original.itemCode) return
            const { itemCode } = row.original
            const newRowSelection = { ...rowSelection }
            if (rowSelection[itemCode]) {
                delete newRowSelection[itemCode]
            } else {
                newRowSelection[itemCode] = row.original
            }
            setRowSelection(newRowSelection)
        },
        [rowSelection, setRowSelection],
    )

    const clearSelectedRows = useCallback(() => setRowSelection({}), [setRowSelection])

    const isRowSelected = useCallback(
        (row: Row<ApiCodelistItem>) => {
            return row.original.itemCode ? !!rowSelection[row.original.itemCode] : false
        },
        [rowSelection],
    )

    const columns: Array<ColumnDef<ApiCodelistItem>> = []

    if (ability.can(Actions.BULK_ACTIONS, Subjects.ITEM)) {
        columns.push(
            {
                id: CHECKBOX_CELL,
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
                        rowsWithoutDisabled.every((row) => (row.original.itemCode ? !!rowSelection[row.original.itemCode] : false))
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
                                onClick={(event) => event.stopPropagation()}
                                onChange={() => handleCheckboxChange(row)}
                                checked={row.original.itemCode ? !!rowSelection[row.original.itemCode] : false}
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
        size: 150,
        accessorFn: (row) => row.codelistItemNames,
        enableSorting: true,
        meta: {
            getCellContext: (ctx) => selectBasedOnLanguageAndDate(ctx.getValue() as ApiCodelistItemName[], workingLanguage),
        },
        cell: (row) => selectBasedOnLanguageAndDate(row.getValue() as ApiCodelistItemName[], workingLanguage),
    })

    if (ability.can(Actions.BULK_ACTIONS, Subjects.ITEM)) {
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
                        handleOpenEditItem={handleOpenEditItem}
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
