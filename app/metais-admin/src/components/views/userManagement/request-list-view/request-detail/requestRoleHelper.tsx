import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { ColumnDef, Table } from '@tanstack/react-table'
import { TFunction } from 'i18next'

import { RoleItem } from './RequestRolesForm'

import { RoleTable } from '@/components/views/egov/management-list-views/UserRolesForm'

const reduceTableDataToObject = <T extends { uuid?: string }>(array: T[]): Record<string, T> => {
    return array.reduce<Record<string, T>>((result, item) => {
        if (item.uuid) {
            result[item.uuid] = item
        }
        return result
    }, {})
}

export const getColumns = (
    t: TFunction<'translation', undefined, 'translation'>,
    rowSelection: Record<string, RoleTable>,
    setRowSelection: (value: React.SetStateAction<Record<string, RoleTable>>) => void,
    handleCanApprove: (rows: Record<string, RoleItem>) => void,
    tableData?: RoleTable[],
): ColumnDef<RoleTable>[] => {
    const handleAllCheckboxChange = (table: Table<RoleTable>) => {
        const checked = table.getRowModel().rows.every((row) => (row.original.uuid ? !!rowSelection[row.original.uuid] : false))
        const newRowSelection = { ...rowSelection }
        if (checked) {
            table.getRowModel().rows.forEach((row) => row.original.uuid && delete newRowSelection[row.original.uuid])

            handleCanApprove(newRowSelection)
            setRowSelection(newRowSelection)
        } else {
            setRowSelection((val) => {
                const reduced = { ...val, ...reduceTableDataToObject<RoleTable>(tableData || []) }
                handleCanApprove(reduced)
                return reduced
            })
        }
    }

    return [
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
                            onChange={() => handleAllCheckboxChange(table)}
                            checked={table.getRowModel().rows.every((row) => (row.original.uuid ? !!rowSelection[row.original.uuid] : false))}
                        />
                    </div>
                )
            },
            id: CHECKBOX_CELL,
            cell: ({ row }) => (
                <div className="govuk-checkboxes govuk-checkboxes--small" id={`checkbox_div_${row.id}`}>
                    <CheckBox
                        label=""
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

                                handleCanApprove(newRowSelection)
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
}
