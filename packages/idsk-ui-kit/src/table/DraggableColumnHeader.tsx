import React from 'react'
import { Column, ColumnOrderState, Header, Table as ReactTable, SortDirection, flexRender } from '@tanstack/react-table'
import { useDrag, useDrop } from 'react-dnd'
import classNames from 'classnames'
import { ATTRIBUTE_NAME } from '@isdd/metais-common/src/api'
import './header.scss'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'

import styles from './table.module.scss'
import { CHECKBOX_CELL } from './constants'

import { TextBody } from '@isdd/idsk-ui-kit/typography/TextBody'

const reorderColumn = (draggedColumnId: string, targetColumnId: string, columnOrder: string[]): ColumnOrderState => {
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

const getAriaSort = (sort: SortDirection | false) => {
    switch (sort) {
        case 'asc':
            return 'ascending'
        case 'desc':
            return 'descending'
        default:
            return 'none'
    }
}

const getSortButtonLabel = (sort: SortDirection | false, t: TFunction<'translation', undefined, 'translation'>) => {
    switch (sort) {
        case 'asc':
            return t('table.desc')
        case 'desc':
            return ''
        default:
            return t('table.asc')
    }
}

export const DraggableColumnHeader = <T,>({ header, table, canDrag }: TableHeaderProps<T>): JSX.Element => {
    const { t, i18n } = useTranslation()
    const { getState, setColumnOrder } = table
    const { columnOrder } = getState()
    const { column, colSpan, getContext, isPlaceholder, id } = header
    const columnHeader = column.columnDef.header
    const headerString = typeof columnHeader == 'string' ? columnHeader : columnHeader?.(getContext())
    const columnEnabledSorting = header.column.columnDef.enableSorting
    const canDragAndDrop = canDrag && header.id !== ATTRIBUTE_NAME.Gen_Profil_nazov

    const [, dropRef] = useDrop({
        accept: 'column',
        drop: (draggedColumn: Column<T>) => {
            if (draggedColumn.id !== column.id) {
                const newColumnOrder = reorderColumn(draggedColumn.id, column.id, columnOrder)
                setColumnOrder(newColumnOrder)
            }
        },
        canDrop: () => canDragAndDrop,
    })

    const [{ isDragging }, dragRef, previewRef] = useDrag({
        canDrag: canDragAndDrop,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        item: () => column,
        type: 'column',
    })

    const sortDesc = column.getIsSorted() == 'desc'
    const ariaLabelForSortButton = sortDesc
        ? t('table.unsort', { item: headerString })
        : t('table.sortButtonLabel', {
              item: headerString,
              sortDirection: getSortButtonLabel(column.getIsSorted(), t),
          })

    return id === CHECKBOX_CELL ? (
        <td className={classNames('idsk-table__header', styles.header, styles.checkBoxCell)}>{flexRender(columnHeader, getContext())}</td>
    ) : (
        <th
            id={header.id}
            ref={dropRef}
            className={classNames('idsk-table__header', styles.header, {
                [styles.checkBoxCell]: id === CHECKBOX_CELL,
                [styles.widthAuto]: !header.column.columnDef.size,
                [styles.dragged]: isDragging,
            })}
            colSpan={colSpan}
            aria-sort={getAriaSort(column.getIsSorted())}
            style={{
                ...(header.column.columnDef.size ? { width: header.column.columnDef.size } : { width: 'auto' }),
            }}
        >
            <div ref={previewRef}>
                <div ref={dragRef}>
                    <TextBody size="S" className="marginBottom0 th-span">
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
                                    lang={i18n.language}
                                >
                                    <span className="sr-only">&nbsp;{ariaLabelForSortButton}</span>
                                </button>
                            )}
                        </strong>
                    </TextBody>
                </div>
            </div>
        </th>
    )
}
