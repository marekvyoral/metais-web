import React from 'react'
import { Table } from '@/components/table/Table'
import { ColumnDef } from '@tanstack/react-table'
import { CheckBox } from '@/components/CheckBox'
import { Paginator } from '@/components/paginator/Paginator'

interface TableCols {
    attributes: any
    metaAttributes: any
}
interface DocumentsTable {
    data: any //todo: missing return types from orval
    isLoading: boolean
    isError: boolean
    additionalColumns?: Array<ColumnDef<TableCols>>
}

const Loading: React.FC = () => {
    return <div>loading</div>
}

const Error: React.FC = () => {
    return <div>error</div>
}

export const DocumentsTableView: React.FC<DocumentsTable> = ({ data, additionalColumns, isLoading, isError }) => {
    if (isLoading) return <Loading />
    if (isError) return <Error />
    debugger

    const additionalColumnsNullsafe = additionalColumns ?? []
    const columns: Array<ColumnDef<TableCols>> = [
        {
            accessorFn: (row) => row.selected,
            header: () => (
                <>
                    <CheckBox label="" name="hi" id="hi" value="hi" />
                </>
            ),
            id: '0',
            cell: (row) => <CheckBox label={row.getValue() as string} name="hi" id="hi" value="hi" />,
        },
        {
            accessorFn: (row) => row?.attributes?.Gen_Profil_nazov,
            header: 'Name',
            id: '1',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.attributes?.Gen_Profil_poznamka,
            header: 'Note',
            id: '2',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.metaAttributes?.state,
            header: 'Evidence status',
            id: '3',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.metaAttributes?.createdAt,
            header: 'Created',
            id: '4',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.metaAttributes?.lastModifiedAt,
            header: 'Last change',
            id: '5',
            cell: (row) => row.getValue() as string,
        },
        ...additionalColumnsNullsafe,
    ]

    return (
        <>
            <Table columns={columns} data={data} />
            <Paginator dataLength={100} pageNumber={1} onPageChanged={() => {}} pageSize={10} />
        </>
    ) //todo: paginator wrapper
}
