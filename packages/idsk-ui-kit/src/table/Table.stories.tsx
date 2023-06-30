import { Meta, StoryObj } from '@storybook/react'
import { ColumnDef, ColumnOrderState, PaginationState, SortingState, ExpandedState } from '@tanstack/react-table'
import React, { useState } from 'react'

import { Table } from './Table'
import { TableMetaBlock } from './TableMetaBlock'
import { ExpandableHeaderCellWrapper } from './ExpandableHeaderCellWrapper'
import { ExpandableRowCellWrapper } from './ExpandableRowCellWrapper'
import { resetColumnOrder } from './tableUtils'
import { CHECKBOX_CELL } from './constants'

import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'

const meta: Meta<typeof Table> = {
    title: 'Components/Table',
    component: Table,
}

export type Person = {
    firstName: string
    lastName: string
    age: number
    subRows?: Person[]
    check?: boolean
}

const testTableData: Person[] = [
    {
        firstName: 'tanner',
        lastName: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
        age: 18,
        subRows: [
            {
                firstName: 'tanner-first-subchild',
                lastName: 'linsley-first-subchild',
                age: 25,
                subRows: [
                    {
                        firstName: 'tanner-second-subchild',
                        lastName: 'linsley-second-subchild',
                        age: 48,
                    },
                ],
            },
        ],
    },
    {
        firstName: 'tandy',
        lastName: 'miller',
        age: 20,
        subRows: [
            {
                firstName: 'tanner-1',
                lastName: 'linsley',
                age: 18,
            },
        ],
    },
    {
        firstName: 'joe',
        lastName: 'dirte',
        age: 20,
        subRows: [
            {
                firstName: 'tanner-2',
                lastName: 'linsley',
                age: 10,
            },
        ],
    },
    {
        firstName: 'tanner',
        lastName: 'linsley',
        age: 20,
    },
    {
        firstName: 'tandy',
        lastName: 'miller',
        age: 45,
    },
    {
        firstName: 'joe',
        lastName: 'dirte',
        age: 65,
    },
]

const minimalColumnsSpec: ColumnDef<Person>[] = [
    {
        accessorFn: (row) => row.firstName,
        id: 'firstName',
        header: 'First Name',
    },
    {
        id: 'lastName',
        accessorKey: 'lastName',
        header: 'Last Name',
    },
    {
        accessorKey: 'age',
        id: 'age',
        header: 'Age',
    },
]

const sortableColumnsSpec: ColumnDef<Person>[] = [
    {
        accessorFn: (row) => row.firstName,
        id: 'firstName',
        header: 'First Name',
        enableSorting: true,
    },
    {
        id: 'lastName',
        accessorKey: 'lastName',
        header: 'Last Name',
        enableSorting: true,
    },
    {
        accessorKey: 'age',
        id: 'age',
        header: 'Age',
        enableSorting: true,
    },
]

const SelectableColumnsSpec: ColumnDef<Person>[] = [
    {
        accessorFn: (row) => row.check,
        header: ({ table }) => (
            <div className="govuk-checkboxes govuk-checkboxes--small">
                <CheckBox
                    label=""
                    name="checkbox"
                    id="checkbox_all"
                    value="true"
                    onChange={table.getToggleAllRowsSelectedHandler()}
                    checked={table.getIsAllPageRowsSelected()}
                />
            </div>
        ),
        id: CHECKBOX_CELL,
        cell: ({ row }) => (
            <div className="govuk-checkboxes govuk-checkboxes--small">
                <CheckBox
                    label=""
                    name="checkbox"
                    id={`checkbox_${row.id}`}
                    value="true"
                    onChange={row.getToggleSelectedHandler()}
                    checked={row.getIsSelected()}
                />
            </div>
        ),
    },
    {
        accessorFn: (row) => row.firstName,
        id: 'firstName',
        header: 'First Name',
    },
    {
        id: 'lastName',
        accessorKey: 'lastName',
        header: 'Last Name',
    },
    {
        accessorKey: 'age',
        id: 'age',
        header: 'Age',
    },
]

const expandableColumnsSpec: ColumnDef<Person>[] = [
    {
        accessorFn: (row) => row.firstName,
        id: 'firstName',
        header: ({ table }) => <ExpandableHeaderCellWrapper table={table}> First Name </ExpandableHeaderCellWrapper>,
        cell: ({ row }) => <ExpandableRowCellWrapper row={row}> {row.original.firstName} </ExpandableRowCellWrapper>,
        enableSorting: true,
    },
    {
        accessorFn: (row) => row.lastName,
        id: 'lastName',
        header: 'Last Name',
        cell: (info) => info.getValue(),
        enableSorting: true,
    },
    {
        accessorFn: (row) => row.age,
        id: 'age',
        header: 'Age',
        enableSorting: true,
    },
]

type Story = StoryObj<typeof Table<Person>>

export default meta

export const MinimalTable: Story = {
    render: ({ ...args }) => {
        const StateWrapper = () => {
            return <Table<Person> {...args} />
        }
        return <StateWrapper />
    },
    args: {
        data: testTableData,
        columns: minimalColumnsSpec,
    },
}

export const NoRowsTable: Story = {
    render: ({ ...args }) => {
        const StateWrapper = () => {
            return <Table<Person> {...args} />
        }
        return <StateWrapper />
    },
    args: {
        columns: minimalColumnsSpec,
    },
}

export const LoadingNoRows: Story = {
    render: ({ ...args }) => {
        const StateWrapper = () => {
            return <Table<Person> {...args} />
        }
        return <StateWrapper />
    },
    args: {
        isLoading: true,
        columns: minimalColumnsSpec,
    },
}

export const LoadingWithPreviousData: Story = {
    render: ({ ...args }) => {
        const StateWrapper = () => {
            return <Table<Person> {...args} />
        }
        return <StateWrapper />
    },
    args: {
        data: testTableData,
        isLoading: true,
        columns: minimalColumnsSpec,
    },
}

export const ErrorTable: Story = {
    render: ({ ...args }) => {
        const StateWrapper = () => {
            return <Table<Person> {...args} />
        }
        return <StateWrapper />
    },
    args: {
        columns: minimalColumnsSpec,
        error: true,
    },
}

export const DraggableColumns: Story = {
    render: ({ ...args }) => {
        const StateWrapper = () => {
            const [sorting, setSorting] = useState<SortingState>([])
            const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(sortableColumnsSpec.map((d) => d.id || ''))
            const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
            const isOrderModified = JSON.stringify(columnOrder) !== JSON.stringify(sortableColumnsSpec.map((d) => d.id || ''))
            return (
                <>
                    <Table<Person>
                        {...args}
                        sorting={sorting}
                        onSortingChange={setSorting}
                        pagination={pagination}
                        onPaginationChange={setPagination}
                        onColumnOrderChange={setColumnOrder}
                        columnOrder={columnOrder}
                    />
                    <TableMetaBlock
                        showResetColumnOrderButton
                        resetColumnOrder={() => resetColumnOrder(args.columns, setColumnOrder)}
                        isOrderModified={isOrderModified}
                    />
                </>
            )
        }
        return <StateWrapper />
    },
    args: {
        data: testTableData,
        columns: sortableColumnsSpec,
        canDrag: true,
    },
}

export const SelectableRows: Story = {
    render: ({ ...args }) => {
        const StateWrapper = () => {
            const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
            return <Table<Person> {...args} onRowSelectionChange={setRowSelection} rowSelection={rowSelection} />
        }
        return <StateWrapper />
    },
    args: {
        data: testTableData,
        columns: SelectableColumnsSpec,
    },
}

export const ExpandableRows: Story = {
    render: ({ ...args }) => {
        const StateWrapper = () => {
            const [sorting, setSorting] = useState<SortingState>([])
            const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(expandableColumnsSpec.map((d) => d.id || ''))
            const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 100 })
            const [expanded, setExpanded] = useState<ExpandedState>({})
            return (
                <Table<Person>
                    {...args}
                    expandedRowsState={expanded}
                    onExpandedChange={setExpanded}
                    getSubRows={(row: Person) => row.subRows}
                    sorting={sorting}
                    onSortingChange={setSorting}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    onColumnOrderChange={setColumnOrder}
                    columnOrder={columnOrder}
                />
            )
        }
        return <StateWrapper />
    },
    args: {
        data: testTableData,
        columns: expandableColumnsSpec,
        canDrag: false,
    },
}
