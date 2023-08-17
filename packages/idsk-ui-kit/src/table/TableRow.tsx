import { Row, flexRender } from '@tanstack/react-table'
import classNames from 'classnames'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import styles from './table.module.scss'
import { CHECKBOX_CELL } from './constants'

interface ITableRowProps<T> {
    row: Row<T>
    isRowSelected?: (row: Row<T>) => boolean
    isRowBold?: (row: Row<T>) => boolean
    onRowClick?: (row: Row<T>) => void
    rowHref?: (row: Row<T>) => string
}

export const TableRow = <T,>({ row, isRowSelected, isRowBold, onRowClick, rowHref }: ITableRowProps<T>): JSX.Element => {
    const navigate = useNavigate()
    return (
        <tr
            className={classNames('idsk-table__row', { [styles.fontWeightBolder]: isRowBold && isRowBold(row) }, styles.rowHover)}
            onClick={() => {
                if (rowHref) {
                    navigate(rowHref(row))
                }
                onRowClick?.(row)
            }}
        >
            {row.getVisibleCells().map((cell) => {
                const columnDef = cell.column.columnDef
                return (
                    <td
                        className={classNames('idsk-table__cell', {
                            [styles.checkBoxCell]: cell.column.id === CHECKBOX_CELL,
                            [styles.rowSelected]: isRowSelected && isRowSelected(row),
                        })}
                        style={columnDef.size ? { width: columnDef.size } : {}}
                        key={cell.id}
                    >
                        {flexRender(columnDef.cell, cell.getContext())}
                    </td>
                )
            })}
        </tr>
    )
}
