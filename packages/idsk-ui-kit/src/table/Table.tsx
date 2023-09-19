import {
    ColumnDef,
    ColumnOrderState,
    ExpandedState,
    OnChangeFn,
    PaginationState,
    Row,
    RowSelectionState,
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import classNames from 'classnames'
import React, { useEffect, useRef, useState } from 'react'

import { DraggableColumnHeader } from './DraggableColumnHeader'
import { TableInfoMessage } from './TableInfoMessage'
import { TableRow } from './TableRow'
import { TableRowExpanded } from './TableRowExpanded'
import { CHECKBOX_CELL } from './constants'
import styles from './table.module.scss'
import { transformColumnSortToSortingState, transformSortingStateToColumnSort } from './tableUtils'

import { ColumnSort } from '@isdd/idsk-ui-kit/types'

export interface ITableProps<T> {
    data?: Array<T>
    columns: Array<ColumnDef<T>>
    canDrag?: boolean
    sort?: ColumnSort[]
    onSortingChange?: (sort: ColumnSort[]) => void
    columnOrder?: ColumnOrderState
    onColumnOrderChange?: OnChangeFn<ColumnOrderState>
    pagination?: PaginationState
    rowSelection?: RowSelectionState
    onPaginationChange?: OnChangeFn<PaginationState> | undefined
    expandedRowsState?: ExpandedState
    onExpandedChange?: React.Dispatch<React.SetStateAction<ExpandedState>>
    onRowSelectionChange?: OnChangeFn<RowSelectionState> | undefined
    getSubRows?: (row: T) => T[] | undefined
    isRowSelected?: (row: Row<T>) => boolean
    isRowBold?: (row: Row<T>) => boolean
    isRowDanger?: (row: Row<T>) => boolean
    isLoading?: boolean
    error?: boolean
    getExpandedRow?: (row: Row<T>) => JSX.Element | null
    onRowClick?: (row: Row<T>) => void
    rowHref?: (row: Row<T>) => string
}

export const Table = <T,>({
    data,
    columns,
    canDrag = false,
    sort,
    onSortingChange,
    columnOrder,
    onColumnOrderChange,
    pagination,
    rowSelection,
    onRowSelectionChange,
    onPaginationChange,
    expandedRowsState,
    onExpandedChange,
    getSubRows,
    isRowSelected,
    isRowBold,
    isRowDanger,
    isLoading = false,
    error = false,
    getExpandedRow,
    onRowClick,
    rowHref,
}: ITableProps<T>): JSX.Element => {
    const wrapper1Ref = useRef<HTMLTableSectionElement>(null)
    const wrapper2Ref = useRef<HTMLTableSectionElement>(null)

    const [columnOrderState, setColumnOrderState] = useState<ColumnOrderState>(columnOrder || columns.map((d) => d.id || ''))

    useEffect(() => {
        if (!canDrag) return
        if (!columnOrder) setColumnOrderState(columns.map((column) => column.id || ''))
        else setColumnOrderState(columnOrder)
    }, [columnOrder, columns, canDrag])

    const transformedSort = transformColumnSortToSortingState(sort)

    const table = useReactTable({
        data: data ?? [],
        columns,
        state: {
            ...(pagination && { pagination }),
            columnOrder: columnOrderState,
            sorting: transformedSort,
            expanded: expandedRowsState,
            rowSelection,
        },

        onRowSelectionChange,
        onSortingChange: (sortUpdater) => {
            if (typeof sortUpdater === 'function') {
                const columnSort = transformSortingStateToColumnSort(sortUpdater, transformedSort)
                onSortingChange?.(columnSort)
            }
        },
        getSortedRowModel: getSortedRowModel(),
        onColumnOrderChange: onColumnOrderChange || setColumnOrderState,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange,
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange,
        getSubRows: getSubRows,
        enableMultiSort: true,
        manualPagination: true,
        getRowCanExpand: getExpandedRow ? (row) => !!getExpandedRow(row) : undefined,
        defaultColumn: {
            size: undefined,
        },
    })

    const isEmptyRows = table.getRowModel().rows.length === 0

    const handleWrapper1Scroll = () => {
        if (wrapper1Ref.current && wrapper2Ref.current) {
            wrapper2Ref.current.scrollLeft = wrapper1Ref.current.scrollLeft
        }
    }

    const handleWrapper2Scroll = () => {
        if (wrapper1Ref.current && wrapper2Ref.current) {
            wrapper1Ref.current.scrollLeft = wrapper2Ref.current.scrollLeft
        }
    }

    return (
        <table className={classNames('idsk-table', [styles.displayBlock, styles.tableSticky, styles.initialOverflow])}>
            <thead className={classNames('idsk-table__head', [styles.head])} onScroll={handleWrapper2Scroll} ref={wrapper2Ref}>
                {table.getHeaderGroups().map((headerGroup) => {
                    const hasCheckbox = headerGroup.headers.find((cell) => cell.id === CHECKBOX_CELL)
                    return (
                        <tr
                            className={classNames('idsk-table__row', styles.headerRow, {
                                [styles.checkBoxHeaderRow]: hasCheckbox,
                            })}
                            key={headerGroup.id}
                        >
                            {headerGroup.headers.map((header) => {
                                return <DraggableColumnHeader<T> key={header.id} header={header} table={table} canDrag={canDrag} />
                            })}
                        </tr>
                    )
                })}
            </thead>
            {!isLoading && isEmptyRows && (
                <tbody className={styles.displayFlex}>
                    <tr>
                        <td>
                            <TableInfoMessage error={error} isEmptyRows={isEmptyRows} key="info" />
                        </td>
                    </tr>
                </tbody>
            )}

            <tbody
                className={classNames('idsk-table__body', styles.body, {
                    [styles.positionRelative]: isLoading,
                    [styles.minHeight400]: isEmptyRows && isLoading,
                })}
                onScroll={handleWrapper1Scroll}
                ref={wrapper1Ref}
            >
                {table.getRowModel().rows.map((row, index) => (
                    <React.Fragment key={index}>
                        <TableRow<T>
                            row={row}
                            key={index}
                            isRowSelected={isRowSelected}
                            isRowBold={isRowBold}
                            isRowDanger={isRowDanger}
                            onRowClick={onRowClick}
                            rowHref={rowHref}
                        />
                        {row.getIsExpanded() && getExpandedRow && <TableRowExpanded row={row} getExpandedRow={getExpandedRow} />}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    )
}
