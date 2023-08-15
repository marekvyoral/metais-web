import React from 'react'
import { Column, ColumnOrderState, Header, Table as ReactTable, flexRender } from '@tanstack/react-table'
import { useDrag, useDrop } from 'react-dnd'
import classNames from 'classnames'

import styles from './table.module.scss'
import { CHECKBOX_CELL } from './constants'

import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'

const reorderColumn = (draggedColumnId: string, targetColumnId: string, columnOrder: string[]): ColumnOrderState => {
    const newColumnOrder = columnOrder
    const startSplicing = newColumnOrder.indexOf(targetColumnId)
    const items = newColumnOrder.splice(newColumnOrder.indexOf(draggedColumnId), 1)[0]
    newColumnOrder.splice(startSplicing, 0, items)
    return [...newColumnOrder]
}

type TableHeaderProps<T> = {
    header: Header<T, unknown>
    table: ReactTable<T>
    canDrag: boolean
}

export const DraggableColumnHeader = <T,>({ header, table, canDrag }: TableHeaderProps<T>): JSX.Element => {
    const { getState, setColumnOrder } = table
    const { columnOrder } = getState()
    const { column, colSpan, getContext, isPlaceholder, id } = header

    const columnHeader = column.columnDef.header
    const columnEnabledSorting = header.column.columnDef.enableSorting

    const [, dropRef] = useDrop({
        accept: 'column',
        drop: (draggedColumn: Column<T>) => {
            const newColumnOrder = reorderColumn(draggedColumn.id, column.id, columnOrder)
            setColumnOrder(newColumnOrder)
        },
    })

    const [{ isDragging }, dragRef, previewRef] = useDrag({
        canDrag,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        item: () => column,
        type: 'column',
    })

    return (
        <th
            ref={dropRef}
            className={classNames('idsk-table__header', styles.header, {
                [styles.checkBoxCell]: id === CHECKBOX_CELL,
                [styles.width]: id !== CHECKBOX_CELL,
            })}
            colSpan={colSpan}
            style={{ opacity: isDragging ? 0.5 : 1, ...(header.column.columnDef.size ? { width: header.column.columnDef.size } : {}) }}
        >
            <div ref={previewRef}>
                <div ref={dragRef} className="th-span">
                    {id === CHECKBOX_CELL ? (
                        flexRender(columnHeader, getContext())
                    ) : (
                        <TextBody size="S" className={'marginBottom0'}>
                            <strong className={styles.columnHeaderStrong}>
                                {isPlaceholder ? null : flexRender(columnHeader, getContext())}
                                {column.getCanSort() && columnEnabledSorting && (
                                    <button
                                        className="arrowBtn"
                                        onClick={column.getToggleSortingHandler()}
                                        style={{ opacity: column.getIsSorted() === false ? 0.1 : 1 }}
                                    />
                                )}
                            </strong>
                        </TextBody>
                    )}
                </div>
            </div>
        </th>
    )
}
