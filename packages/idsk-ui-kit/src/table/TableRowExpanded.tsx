import { Row } from '@tanstack/react-table'
import React from 'react'

interface ITableRowProps<T> {
    getExpandedRow?: (row: Row<T>) => JSX.Element | null
    row: Row<T>
}

export const TableRowExpanded = <T,>({ row, getExpandedRow: getExpandedRow }: ITableRowProps<T>): JSX.Element => {
    return (
        <tr className="idsk-table__row">
            <td colSpan={row.getVisibleCells().length} className="idsk-table__cell">
                {getExpandedRow?.(row)}
            </td>
        </tr>
    )
}
