import { Row, flexRender } from '@tanstack/react-table'
import classNames from 'classnames'
import { useNavigate } from 'react-router-dom'
import React from 'react'

import { CHECKBOX_CELL, TOOLTIP_TEXT_BREAKER } from './constants'
import styles from './table.module.scss'

import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

interface ITableRowProps<T> {
    row: Row<T>
    isRowSelected?: (row: Row<T>) => boolean
    isRowBold?: (row: Row<T>) => boolean
    isRowDanger?: (row: Row<T>) => boolean
    onRowClick?: (row: Row<T>) => void
    rowHref?: (row: Row<T>) => string
}

export const TableRow = <T,>({ row, isRowSelected, isRowBold, isRowDanger, onRowClick, rowHref }: ITableRowProps<T>): JSX.Element => {
    const navigate = useNavigate()
    const hasCheckbox = row.getVisibleCells().find((cell) => cell.column.id === CHECKBOX_CELL)
    return (
        <tr
            className={classNames(
                'idsk-table__row',
                { [styles.fontWeightBolder]: isRowBold && isRowBold(row) },
                styles.rowHover,
                styles.tableRow,
                styles.tableRowMinHeight,
                {
                    [styles.danger]: isRowDanger && isRowDanger(row),
                    [styles.checkBoxRow]: hasCheckbox,
                },
            )}
            onClick={() => {
                if (rowHref) {
                    navigate(rowHref(row), { state: { from: location } })
                }
                onRowClick?.(row)
            }}
        >
            {row.getVisibleCells().map((cell) => {
                const columnDef = cell.column.columnDef
                const meta = columnDef.meta && columnDef.meta.getCellContext && columnDef.meta.getCellContext(cell.getContext())
                const cellValue = flexRender(columnDef.cell, cell.getContext())
                const shortString = typeof meta === 'string' && meta.length >= TOOLTIP_TEXT_BREAKER

                return (
                    <td
                        className={classNames('idsk-table__cell', {
                            [styles.checkBoxCell]: cell.column.id === CHECKBOX_CELL,
                            [styles.rowSelected]: isRowSelected && isRowSelected(row),
                        })}
                        style={columnDef.size ? { width: columnDef.size } : { width: 'auto' }}
                        key={cell.id}
                    >
                        <Tooltip
                            position={'top center'}
                            disabled={
                                cell.column.id === CHECKBOX_CELL ||
                                cell.getValue() === '' ||
                                cell.getValue() === undefined ||
                                cell.getValue() === null ||
                                !shortString
                            }
                            descriptionElement={<div className={styles.tooltipWidth500}>{cellValue}</div>}
                            tooltipContent={(open, close) => (
                                <div className={styles.tooltipTextWrapper} onMouseOver={open} onMouseOut={close}>
                                    {cellValue}
                                </div>
                            )}
                        />
                    </td>
                )
            })}
        </tr>
    )
}
