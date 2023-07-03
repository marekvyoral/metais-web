import {
    ColumnDef,
    ColumnOrderState,
    ExpandedState,
    OnChangeFn,
    PaginationState,
    Row,
    SortingState,
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import classNames from 'classnames'
import React from 'react'

import { DraggableColumnHeader } from './DraggableColumnHeader'
import { TableInfoMessage } from './TableInfoMessage'
import { TableRow } from './TableRow'
import styles from './table.module.scss'

import { LoadingIndicator } from '@isdd/idsk-ui-kit/loading-indicator/LoadingIndicator'

interface ITableProps<T> {
    data?: Array<T>
    columns: Array<ColumnDef<T>>
    canDrag?: boolean
    sorting?: SortingState
    onSortingChange?: OnChangeFn<SortingState> | undefined
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
}

export const Table = <T,>({
    data,
    columns,
    canDrag = false,
    sorting,
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
}: ITableProps<T>): JSX.Element => {
    const table = useReactTable({
        data: data ?? [],
        columns,
        state: {
            ...(pagination && { pagination }),
            columnOrder,
            sorting,
            expanded: expandedRowsState,
        },
        onSortingChange,
        getSortedRowModel: getSortedRowModel(),
        onColumnOrderChange,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange,
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange,
        getSubRows,
        enableMultiSort: true,
    })

    const isEmptyRows = table.getRowModel().rows.length === 0

    return (
        <table className="idsk-table">
            <thead className={classNames('idsk-table__head', [styles.head])}>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr className="idsk-table__row" key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <DraggableColumnHeader<T> key={header.id} header={header} table={table} canDrag={canDrag} />
                        ))}
                    </tr>
                ))}
            </thead>
            <div className={styles.displayFlex}>
                <TableInfoMessage error={error} isEmptyRows={isEmptyRows} />
            </div>
            <tbody
                className={classNames('idsk-table__body', styles.body, {
                    [styles.positionRelative]: isLoading,
                    [styles.minHeight400]: isEmptyRows && isLoading,
                })}
            >
                {isLoading && <LoadingIndicator />}
                {table.getRowModel().rows.map((row) => (
                    <TableRow<T> row={row} key={row.id} isRowSelected={isRowSelected} />
                ))}
            </tbody>
        </table>
    )
}
