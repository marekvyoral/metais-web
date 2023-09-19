import { CheckBox } from '@isdd/idsk-ui-kit/index'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { Notification } from '@isdd/metais-common/api/generated/notifications-swagger'
import { ColumnDef, Row, Table } from '@tanstack/react-table'
import React from 'react'
export const firstLetterToLowerCase = (str: string): string => {
    return str.charAt(0).toLocaleLowerCase() + str.slice(1)
}

export const reduceTableDataToObjectWithId = <T extends { id?: number }>(array: T[]): Record<string, T> => {
    return array.reduce<Record<string, T>>((result, item) => {
        if (item.id) {
            result[item.id] = item
        }
        return result
    }, {})
}

export const handleAllCheckboxChange = (
    table: Table<Notification>,
    tableData: Notification[],
    rowSelection: Record<string, Notification>,
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, Notification>>>,
) => {
    const checked = table.getRowModel().rows.every((row) => (row.original.id ? !!rowSelection[row.original.id] : false))
    const newRowSelection = { ...rowSelection }
    if (checked) {
        table.getRowModel().rows.forEach((row) => row.original.id && delete newRowSelection[row.original.id])
        setRowSelection(newRowSelection)
    } else {
        setRowSelection((val) => ({ ...val, ...reduceTableDataToObjectWithId<Notification>(tableData) }))
    }
}

export const handleCheckboxChange = (
    row: Row<Notification>,
    rowSelection: Record<string, Notification>,
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, Notification>>>,
) => {
    if (row.original.id) {
        const newRowSelection = { ...rowSelection }
        if (rowSelection[row.original.id]) {
            delete newRowSelection[row.original.id]
        } else {
            newRowSelection[row.original.id] = row.original
        }
        setRowSelection(newRowSelection)
    }
}

export const SelectableColumnsSpec = (
    tableData: Notification[],
    columns: ColumnDef<Notification>[],
    rowSelection: Record<string, Notification>,
    setRowSelection: React.Dispatch<React.SetStateAction<Record<string, Notification>>>,
): ColumnDef<Notification>[] => [
    {
        header: ({ table }) => {
            return (
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox
                        label=""
                        name="checkbox"
                        id="checkbox_all"
                        value="true"
                        onChange={() => {
                            handleAllCheckboxChange(table, tableData, rowSelection, setRowSelection)
                        }}
                        checked={table.getRowModel().rows.every((row) => (row.original.id ? !!rowSelection[row.original.id] : false))}
                    />
                </div>
            )
        },
        size: 45,
        id: CHECKBOX_CELL,
        cell: ({ row }) => (
            <div className="govuk-checkboxes govuk-checkboxes--small">
                <CheckBox
                    label=""
                    name="checkbox"
                    id={`checkbox_${row.id}`}
                    value="true"
                    onChange={() => {
                        handleCheckboxChange(row, rowSelection, setRowSelection)
                    }}
                    checked={row.original.id ? !!rowSelection[row.original.id] : false}
                />
            </div>
        ),
    },
    ...columns,
]
