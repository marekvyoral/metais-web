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
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { DraggableColumnHeader } from './DraggableColumnHeader'
import { TableRow } from './TableRow'

interface ITableProps<T> {
    data: Array<T>
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
}: ITableProps<T>): JSX.Element => {
    const table = useReactTable({
        data,
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

    return (
        <table className="idsk-table">
            <thead className="idsk-table__head">
                <DndProvider backend={HTML5Backend}>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr className="idsk-table__row" key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <DraggableColumnHeader<T> key={header.id} header={header} table={table} canDrag={canDrag} />
                            ))}
                        </tr>
                    ))}
                </DndProvider>
            </thead>
            <tbody className="idsk-table__body">
                {table.getRowModel().rows.map((row) => (
                    <TableRow<T> row={row} key={row.id} />
                ))}
            </tbody>
        </table>
    )
}
