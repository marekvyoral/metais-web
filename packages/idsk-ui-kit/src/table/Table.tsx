import {
    ColumnDef,
    ColumnOrderState,
    ExpandedState,
    OnChangeFn,
    PaginationState,
    Row,
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import classNames from 'classnames'
import React, { useRef } from 'react'

import { DraggableColumnHeader } from './DraggableColumnHeader'
import { TableRow } from './TableRow'
import styles from './table.module.scss'
import { TableInfoMessage } from './TableInfoMessage'
import { transformColumnSortToSortingState, transformSortingStateToColumnSort } from './tableUtils'
import { TableRowExpanded } from './TableRowExpanded'

import { ColumnSort } from '@isdd/idsk-ui-kit/types'

export interface ITableProps<T> {
    data?: Array<T>
    columns: Array<ColumnDef<T>>
    canDrag?: boolean
    sort?: ColumnSort[]
    onSortingChange?: (sort: ColumnSort[]) => void
    columnOrder?: ColumnOrderState
    onColumnOrderChange?: React.Dispatch<React.SetStateAction<ColumnOrderState>>
    pagination?: PaginationState
    onPaginationChange?: OnChangeFn<PaginationState> | undefined
    expandedRowsState?: ExpandedState
    onExpandedChange?: React.Dispatch<React.SetStateAction<ExpandedState>>
    getSubRows?: (row: T) => T[] | undefined
    isRowSelected?: (row: Row<T>) => boolean
    isLoading?: boolean
    error?: boolean
    getExpandedRow?: (row: Row<T>) => JSX.Element | null
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
    onPaginationChange,
    expandedRowsState,
    onExpandedChange,
    getSubRows,
    isRowSelected,
    isLoading = false,
    error = false,
    getExpandedRow,
}: ITableProps<T>): JSX.Element => {
    const wrapper1Ref = useRef<HTMLTableSectionElement>(null)
    const wrapper2Ref = useRef<HTMLTableRowElement>(null)

    const transformedSort = transformColumnSortToSortingState(sort)
    const table = useReactTable({
        data: data ?? [],
        columns,
        state: {
            ...(pagination && { pagination }),
            columnOrder,
            sorting: transformedSort,
            expanded: expandedRowsState,
        },
        onSortingChange: (sortUpdater) => {
            if (typeof sortUpdater === 'function') {
                const columnSort = transformSortingStateToColumnSort(sortUpdater, transformedSort)
                onSortingChange?.(columnSort)
            }
        },
        getSortedRowModel: getSortedRowModel(),
        onColumnOrderChange,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange,
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange,
        getSubRows: getSubRows,
        enableMultiSort: true,
        manualPagination: true,
        getRowCanExpand: getExpandedRow ? (row) => !!getExpandedRow(row) : undefined,
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
        <table className="idsk-table">
            <thead className={classNames('idsk-table__head', [styles.head])}>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr className={`idsk-table__row ${styles.headerRow}`} key={headerGroup.id} onScroll={handleWrapper2Scroll} ref={wrapper2Ref}>
                        {headerGroup.headers.map((header) => (
                            <DraggableColumnHeader<T> key={header.id} header={header} table={table} canDrag={canDrag} />
                        ))}
                    </tr>
                ))}
            </thead>
            {!isLoading && isEmptyRows && (
                <tbody className={styles.displayFlex}>
                    <tr>
                        <td>
                            <TableInfoMessage error={error} isEmptyRows={isEmptyRows} />
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
                {table.getRowModel().rows.map((row) => (
                    <>
                        <TableRow<T> row={row} key={row.id} isRowSelected={isRowSelected} />
                        {row.getIsExpanded() && getExpandedRow && <TableRowExpanded row={row} getExpandedRow={getExpandedRow} />}
                    </>
                ))}
            </tbody>
        </table>
    )
}
