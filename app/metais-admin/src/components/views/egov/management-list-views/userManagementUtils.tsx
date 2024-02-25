import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { CheckBox } from '@isdd/idsk-ui-kit/index'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { TFunction } from 'i18next'

import { RoleTable } from './UserRolesForm'

const reduceTableDataToObject = <T extends { uuid?: string }>(array: T[]): Record<string, T> => {
    return array.reduce<Record<string, T>>((result, item) => {
        if (item.uuid) {
            result[item.uuid] = item
        }
        return result
    }, {})
}

export const SelectableColumnsSpec = (
    t: TFunction<'translation', undefined, 'translation'>,
    rowSelection: Record<string, RoleTable>,
    setRowSelection: (value: React.SetStateAction<Record<string, RoleTable>>) => void,
    tableData?: RoleTable[],
): ColumnDef<RoleTable>[] => [
    {
        accessorFn: (row) => row.check,
        header: ({ table }) => {
            return (
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox
                        label=""
                        name="checkbox"
                        id="checkbox_all"
                        value="true"
                        title={t('table.selectAllItems')}
                        onChange={() => {
                            const checked = table.getRowModel().rows.every((row) => (row.original.uuid ? !!rowSelection[row.original.uuid] : false))
                            const newRowSelection = { ...rowSelection }
                            if (checked) {
                                table.getRowModel().rows.forEach((row) => row.original.uuid && delete newRowSelection[row.original.uuid])
                                setRowSelection(newRowSelection)
                            } else {
                                setRowSelection((val) => ({ ...val, ...reduceTableDataToObject<RoleTable>(tableData || []) }))
                            }
                        }}
                        checked={table.getRowModel().rows.every((row) => (row.original.uuid ? !!rowSelection[row.original.uuid] : false))}
                    />
                </div>
            )
        },
        id: CHECKBOX_CELL,
        cell: ({ row }) => (
            <div className="govuk-checkboxes govuk-checkboxes--small">
                <CheckBox
                    label=""
                    title={t('table.selectItem', { itemName: row.original.name })}
                    name="checkbox"
                    id={`checkbox_${row.id}`}
                    value="true"
                    onChange={() => {
                        if (row.original.uuid) {
                            const newRowSelection = { ...rowSelection }
                            if (rowSelection[row.original.uuid]) {
                                delete newRowSelection[row.original.uuid]
                            } else {
                                newRowSelection[row.original.uuid] = row.original
                            }
                            setRowSelection(newRowSelection)
                        }
                    }}
                    checked={row.original.uuid ? !!rowSelection[row.original.uuid] : false}
                />
            </div>
        ),
    },
    {
        accessorFn: (row) => row.name,
        id: 'name',
        header: t('managementList.name'),
    },
    {
        id: 'description',
        accessorKey: 'description',
        header: t('managementList.description'),
    },
]
