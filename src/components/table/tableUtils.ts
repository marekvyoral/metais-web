import { ColumnDef, ColumnOrderState } from '@tanstack/react-table'
import { Dispatch, SetStateAction } from 'react'

export const resetColumnOrder = <T>(columns: Array<ColumnDef<T>>, setColumnOrder: Dispatch<SetStateAction<ColumnOrderState>>) => {
    setColumnOrder(columns.map((column) => column.id || ''))
}
