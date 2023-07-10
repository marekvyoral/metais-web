import React, { useState } from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { ColumnDef, ColumnOrderState, PaginationState, ExpandedState, Row } from '@tanstack/react-table'

import { reduceTableDataToObject } from '../../../../app/metais-portal/src/components/ci-table/ciTableHelpers'

import { Table } from './Table'
import { TableMetaBlock } from './TableMetaBlock'
import { ExpandableHeaderCellWrapper } from './ExpandableHeaderCellWrapper'
import { ExpandableRowCellWrapper } from './ExpandableRowCellWrapper'
import { resetColumnOrder } from './tableUtils'
import { CHECKBOX_CELL } from './constants'

import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { ColumnSort } from '@/types'

const meta: Meta<typeof Table> = {
    title: 'Components/Table',
    component: Table,
}

export type Person = {
    uuid?: string
    firstName: string
    lastName: string
    age: number
    subRows?: Person[]
    check?: boolean
}

const testTableData: Person[] = [
    {
        uuid: '1',
        firstName: 'tanner',
        lastName: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
        age: 18,
        subRows: [
            {
                uuid: '1-1',
                firstName: 'tanner-first-subchild',
                lastName: 'linsley-first-subchild',
                age: 25,
                subRows: [
                    {
                        uuid: '1-1-1',
                        firstName: 'tanner-second-subchild',
                        lastName: 'linsley-second-subchild',
                        age: 48,
                    },
                ],
            },
        ],
    },
    {
        uuid: '2',
        firstName: 'tandy',
        lastName: 'miller',
        age: 20,
        subRows: [
            {
                uuid: '2-1',
                firstName: 'tanner-1',
                lastName: 'linsley',
                age: 18,
            },
        ],
    },
    {
        uuid: '3',
        firstName: 'joe',
        lastName: 'dirte',
        age: 20,
        subRows: [
            {
                uuid: '3-1',
                firstName: 'tanner-2',
                lastName: 'linsley',
                age: 10,
            },
        ],
    },
    {
        uuid: '4',
        firstName: 'tanner',
        lastName: 'linsley',
        age: 20,
    },
    {
        uuid: '5',
        firstName: 'tandy',
        lastName: 'miller',
        age: 45,
    },
    {
        uuid: '6',
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

const SelectableColumnsSpec = (
    rowSelection: Record<string, Person>,
    setRowSelection: (value: React.SetStateAction<Record<string, Person>>) => void,
    tableData?: Person[],
): ColumnDef<Person>[] => [
    {
        accessorFn: (row) => row.check,
        header: ({ table }) => {
            return (
                <div className="govuk-checkboxes govuk-checkboxes--small">
                    <CheckBox
                        label=""
                        name="checkbox"
                        id="checkbox_all"
                        value="true"
                        onChange={() => {
                            const checked = table.getRowModel().rows.every((row) => (row.original.uuid ? !!rowSelection[row.original.uuid] : false))
                            const newRowSelection = { ...rowSelection }
                            if (checked) {
                                table.getRowModel().rows.forEach((row) => row.original.uuid && delete newRowSelection[row.original.uuid])
                                setRowSelection(newRowSelection)
                            } else {
                                setRowSelection((val) => ({ ...val, ...reduceTableDataToObject<Person>(tableData || []) }))
                            }
                        }}
                        checked={table.getRowModel().rows.every((row) => (row.original.uuid ? !!rowSelection[row.original.uuid] : false))}
                    />
                </div>
            )
        },
        id: CHECKBOX_CELL,
        cell: ({ row }) => (
            <div className="govuk-checkboxes govuk-checkboxes--small">
                <CheckBox
                    label=""
                    name="checkbox"
                    id={`checkbox_${row.id}`}
                    value="true"
                    onChange={() => {
                        if (row.original.uuid) {
                            const newRowSelection = { ...rowSelection }
                            if (rowSelection[row.original.uuid]) {
                                delete newRowSelection[row.original.uuid]
                            } else {
                                newRowSelection[row.original.uuid] = row.original
                            }
                            setRowSelection(newRowSelection)
                        }
                    }}
                    checked={row.original.uuid ? !!rowSelection[row.original.uuid] : false}
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
            const [sort] = useState<ColumnSort[]>([])
            const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(sortableColumnsSpec.map((d) => d.id || ''))
            const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
            const isOrderModified = JSON.stringify(columnOrder) !== JSON.stringify(sortableColumnsSpec.map((d) => d.id || ''))
            return (
                <>
                    <Table<Person>
                        {...args}
                        sort={sort}
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
            const [rowSelection, setRowSelection] = useState<Record<string, Person>>({})
            const isRowSelected = (row: Row<Person>) => {
                return row.original.uuid ? !!rowSelection[row.original.uuid] : false
            }
            console.log('rowSelection', rowSelection)
            return <Table<Person> {...args} columns={SelectableColumnsSpec(rowSelection, setRowSelection, args.data)} isRowSelected={isRowSelected} />
        }
        return <StateWrapper />
    },
    args: {
        data: testTableData,
    },
}

export const ExpandableRows: Story = {
    render: ({ ...args }) => {
        const StateWrapper = () => {
            const [sort] = useState<ColumnSort[]>([])
            const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(expandableColumnsSpec.map((d) => d.id || ''))
            const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 100 })
            const [expanded, setExpanded] = useState<ExpandedState>({})
            return (
                <Table<Person>
                    {...args}
                    expandedRowsState={expanded}
                    onExpandedChange={setExpanded}
                    getSubRows={(row: Person) => row.subRows}
                    sort={sort}
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
