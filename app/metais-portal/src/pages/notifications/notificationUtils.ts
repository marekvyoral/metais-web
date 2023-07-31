import { Row, Table } from '@tanstack/react-table'
import { Notification } from '@isdd/metais-common/api/generated/notifications-swagger'
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
