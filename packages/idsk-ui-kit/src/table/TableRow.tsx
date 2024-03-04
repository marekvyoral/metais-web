import { Row, flexRender } from '@tanstack/react-table'
import classNames from 'classnames'
import { useLocation, useNavigate } from 'react-router-dom'
import React from 'react'

import { CHECKBOX_CELL, TOOLTIP_TEXT_BREAKER } from './constants'
import styles from './table.module.scss'

import { Tooltip } from '@isdd/idsk-ui-kit/tooltip/Tooltip'
import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'

interface ITableRowProps<T> {
    row: Row<T>
    isRowSelected?: (row: Row<T>) => boolean
    isRowBold?: (row: Row<T>) => boolean
    isRowDanger?: (row: Row<T>) => boolean
    onRowClick?: (row: Row<T>) => void
    rowHref?: (row: Row<T>) => string
    linkToNewTab?: boolean
    isInvalidated: boolean
}

export const TableRow = <T,>({
    row,
    isRowSelected,
    isRowBold,
    isRowDanger,
    onRowClick,
    rowHref,
    isInvalidated,
    linkToNewTab,
}: ITableRowProps<T>): JSX.Element => {
    const navigate = useNavigate()
    const location = useLocation()
    const hasCheckbox = row.getVisibleCells().find((cell) => cell.column.id === CHECKBOX_CELL)
    const verticalHeaderColId = hasCheckbox ? row.getVisibleCells()[1].column.id : row.getVisibleCells()[0].column.id

    let headerUsed = false

    return (
        <tr
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
                    if (linkToNewTab) {
                        window.open(rowHref(row), '_blank')
                    } else {
                        navigate(rowHref(row), { state: { from: location } })
                    }
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

                let useHeader = false
                if (!headerUsed) {
                    useHeader = (index === 0 && cell.column.id !== CHECKBOX_CELL) || index === 1
                    if (useHeader) {
                        headerUsed = true
                    }
                }

                const cellContent = hideTooltip ? (
                    cellValue
                ) : (
                    <Tooltip
                        position={'top center'}
                        disabled={
                            cell.column.id === CHECKBOX_CELL ||
                            cell.getValue() === '' ||
                            cell.getValue() === undefined ||
                            cell.getValue() === null ||
                            !shortString
                        }
                        on={['hover', 'focus']}
                        descriptionElement={<div className={styles.tooltipWidth500}>{tooltipText}</div>}
                        tooltipContent={() => <div className={styles.tooltipTextWrapper}>{cellValue}</div>}
                    />
                )
                return useHeader ? (
                    <th
                        tabIndex={0}
                        scope="row"
                        className={classNames('idsk-table__cell', styles.fontWeightNormal, {
                            [styles.fontWeightBolder]: isRowBold && isRowBold(row),
                            [styles.checkBoxCell]: cell.column.id === CHECKBOX_CELL,
                            [styles.rowSelected]: isRowSelected && isRowSelected(row),
                        })}
                        style={columnDef.size ? { width: columnDef.size } : { width: 'auto' }}
                        key={cell.id}
                        id={cell.column.id}
                    >
                        <TextBody size="S" className={'marginBottom0'}>
                            {cellContent}
                        </TextBody>
                    </th>
                ) : (
                    <td
                        tabIndex={0}
                        className={classNames('idsk-table__cell', {
                            [styles.checkBoxCell]: cell.column.id === CHECKBOX_CELL,
                            [styles.rowSelected]: isRowSelected && isRowSelected(row),
                        })}
                        style={columnDef.size ? { width: columnDef.size } : { width: 'auto' }}
                        key={cell.id}
                        headers={`${cell.column.id} ${verticalHeaderColId}`}
                    >
                        <TextBody size="S" className={'marginBottom0'}>
                            {cellContent}
                        </TextBody>
                    </td>
                )
            })}
        </tr>
    )
}
