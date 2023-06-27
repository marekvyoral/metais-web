import { Row, flexRender } from '@tanstack/react-table'
import React from 'react'

interface ITableRowProps<T> {
    row: Row<T>
}

export const TableRow = <T,>({ row }: ITableRowProps<T>): JSX.Element => {
    return (
        <tr className="idsk-table__row">
            {row.getVisibleCells().map((cell) => (
                <td className="idsk-table__cell" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    )
}
