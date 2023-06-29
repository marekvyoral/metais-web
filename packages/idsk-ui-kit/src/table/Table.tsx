import {
    ColumnDef,
    ColumnOrderState,
    ExpandedState,
    OnChangeFn,
    PaginationState,
    SortingState,
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import React from 'react'
import classNames from 'classnames'

import { DraggableColumnHeader } from './DraggableColumnHeader'
import { TableRow } from './TableRow'
import styles from './table.module.scss'
import { TableInfoMessage } from './TableInfoMessage'

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
            <thead className="idsk-table__head">
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
                    <TableRow<T> row={row} key={row.id} />
                ))}
            </tbody>
        </table>
    )
}
