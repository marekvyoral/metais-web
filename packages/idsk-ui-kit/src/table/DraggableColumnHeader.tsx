import React from 'react'
import { Column, ColumnOrderState, Header, Table as ReactTable, flexRender } from '@tanstack/react-table'
import { useDrag, useDrop } from 'react-dnd'
import classNames from 'classnames'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/src/api'
import './header.scss'

import styles from './table.module.scss'
import { CHECKBOX_CELL } from './constants'

import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'

const reorderColumn = (draggedColumnId: string, targetColumnId: string, columnOrder: string[]): ColumnOrderState => {
    if (draggedColumnId === ATTRIBUTE_NAME.Gen_Profil_nazov || targetColumnId === ATTRIBUTE_NAME.Gen_Profil_nazov) return columnOrder
    const newColumnOrder = columnOrder
    const startSplicing = newColumnOrder.indexOf(targetColumnId)
    if (startSplicing === 0) return columnOrder
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

    return id === CHECKBOX_CELL ? (
        <td className={classNames('idsk-table__header', styles.header, styles.checkBoxCell)}>{flexRender(columnHeader, getContext())}</td>
    ) : (
        <th
            scope="col"
            id={header.id}
            ref={dropRef}
            className={classNames('idsk-table__header', styles.header, {
                [styles.checkBoxCell]: id === CHECKBOX_CELL,
            })}
            colSpan={colSpan}
            style={{ opacity: isDragging ? 0.5 : 1, ...(header.column.columnDef.size ? { width: header.column.columnDef.size } : { width: 'auto' }) }}
        >
            <div ref={previewRef}>
                <div ref={dragRef} className="th-span">
                    <TextBody size="S" className={'marginBottom0'}>
                        <strong className={styles.columnHeaderStrong}>
                            {isPlaceholder ? null : flexRender(columnHeader, getContext())}
                            {column.getCanSort() && columnEnabledSorting && (
                                <button
                                    className={classNames(
                                        'arrowBtn',
                                        { arrowBtnDesc: column.getIsSorted() === 'desc' },
                                        { arrowBtnAsc: column.getIsSorted() === 'asc' },
                                    )}
                                    onClick={column.getToggleSortingHandler()}
                                    style={{ opacity: column.getIsSorted() === false ? 0.1 : 1 }}
                                />
                            )}
                        </strong>
                    </TextBody>
                </div>
            </div>
        </th>
    )
}
