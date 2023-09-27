import { Row, flexRender } from '@tanstack/react-table'
import classNames from 'classnames'
import { useLocation, useNavigate } from 'react-router-dom'
import React from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { CHECKBOX_CELL, TOOLTIP_TEXT_BREAKER } from './constants'
import styles from './table.module.scss'

import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'

interface ITableDragRowProps<T> {
    row: Row<T>
    isRowSelected?: (row: Row<T>) => boolean
    isRowBold?: (row: Row<T>) => boolean
    isRowDanger?: (row: Row<T>) => boolean
    onRowClick?: (row: Row<T>) => void
    rowHref?: (row: Row<T>) => string
    reorderRow?: (index: number, target: number) => void
    isInvalidated: boolean
}

export const TableDragRow = <T,>({
    row,
    isRowSelected,
    isRowBold,
    isRowDanger,
    onRowClick,
    rowHref,
    reorderRow,
    isInvalidated,
}: ITableDragRowProps<T>): JSX.Element => {
    const navigate = useNavigate()
    const location = useLocation()
    const hasCheckbox = row.getVisibleCells().find((cell) => cell.column.id === CHECKBOX_CELL)
    const verticalHeaderColId = hasCheckbox ? row.getVisibleCells()[1].column.id : row.getVisibleCells()[0].column.id

    const [, dropRef] = useDrop({
        accept: 'row',
        drop: (draggedRow: Row<T>) => reorderRow?.(draggedRow.index, row.index),
    })

    const [{ isDragging }, dragRef, previewRef] = useDrag({
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        item: () => row,
        type: 'row',
    })

    return (
        <tr
            ref={previewRef}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className={classNames(
                'idsk-table__row',
                { [styles.fontWeightBolder]: isRowBold && isRowBold(row), [styles.invalidated]: isInvalidated },
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
            {row.getVisibleCells().map((cell, index) => {
                const columnDef = cell.column.columnDef
                const tooltipText = columnDef?.meta?.getCellContext?.(cell.getContext())
                const cellValue = flexRender(columnDef.cell, cell.getContext())
                const shortString = typeof tooltipText === 'string' && tooltipText.length >= TOOLTIP_TEXT_BREAKER
                const hideTooltip =
                    cell.column.id === CHECKBOX_CELL ||
                    cell.getValue() === '' ||
                    cell.getValue() === undefined ||
                    cell.getValue() === null ||
                    !shortString
                const useHeader = (index === 0 && cell.column.id !== CHECKBOX_CELL) || index === 1
                const cellContent = hideTooltip ? (
                    cellValue
                ) : (
                    <div ref={index === 0 ? dropRef : null}>
                        <Tooltip
                            position={'top center'}
                            disabled={
                                cell.column.id === CHECKBOX_CELL ||
                                cell.getValue() === '' ||
                                cell.getValue() === undefined ||
                                cell.getValue() === null ||
                                !shortString
                            }
                            descriptionElement={<div className={styles.tooltipWidth500}>{tooltipText}</div>}
                            tooltipContent={(open, close) => (
                                <div className={styles.tooltipTextWrapper} onMouseOver={open} onMouseOut={close}>
                                    {cellValue}
                                </div>
                            )}
                        />
                    </div>
                )
                return useHeader ? (
                    <th
                        scope="row"
                        className={classNames('idsk-table__cell', styles.fontWeightNormal, {
                            [styles.fontWeightBolder]: isRowBold && isRowBold(row),
                            [styles.checkBoxCell]: cell.column.id === CHECKBOX_CELL,
                            [styles.rowSelected]: isRowSelected && isRowSelected(row),
                        })}
                        style={columnDef.size ? { width: columnDef.size } : { width: 'auto' }}
                        key={cell.id}
                        id={cell.column.id}
                        ref={index === 0 ? dropRef : null}
                    >
                        <div ref={index === 0 ? dragRef : null}>{cellContent}</div>
                    </th>
                ) : (
                    <td
                        className={classNames('idsk-table__cell', {
                            [styles.checkBoxCell]: cell.column.id === CHECKBOX_CELL,
                            [styles.rowSelected]: isRowSelected && isRowSelected(row),
                        })}
                        style={columnDef.size ? { width: columnDef.size } : { width: 'auto' }}
                        key={cell.id}
                        headers={`${cell.column.id} ${verticalHeaderColId}`}
                        ref={index === 0 ? dropRef : null}
                    >
                        <div ref={index === 0 ? dragRef : null}>{cellContent}</div>
                    </td>
                )
            })}
        </tr>
    )
}
