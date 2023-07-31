import { Row, flexRender } from '@tanstack/react-table'
import classNames from 'classnames'
import React from 'react'

import styles from './table.module.scss'
import { CHECKBOX_CELL } from './constants'

interface ITableRowProps<T> {
    row: Row<T>
    isRowSelected?: (row: Row<T>) => boolean
    isRowBold?: (row: Row<T>) => boolean
}

export const TableRow = <T,>({ row, isRowSelected, isRowBold }: ITableRowProps<T>): JSX.Element => {
    return (
        <tr className={classNames('idsk-table__row', { [styles.fontWeightBolder]: isRowBold && isRowBold(row) })}>
            {row.getVisibleCells().map((cell) => (
                <td
                    className={classNames('idsk-table__cell', {
                        [styles.checkBoxCell]: cell.column.id === CHECKBOX_CELL,
                        [styles.rowSelected]: isRowSelected && isRowSelected(row),
                    })}
                    style={cell.column.columnDef.size ? { width: cell.column.columnDef.size } : {}}
                    key={cell.id}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    )
}
