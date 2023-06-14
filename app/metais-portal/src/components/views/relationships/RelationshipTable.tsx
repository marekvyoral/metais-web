import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { Paginator } from '@isdd/idsk-ui-kit/paginator/Paginator'
import { TableCols } from '../documents'

interface RelationshipsTable {
    data: TableCols[] //missing return types from orval, types should come from backend, not from _GeneratedType file
    isLoading: boolean
    isError: boolean
    columns: Array<ColumnDef<TableCols>>
}

const Loading: React.FC = () => {
    return <div>loading</div>
}

const Error: React.FC = () => {
    return <div>error</div>
}

export const RelationshipsTable: React.FC<RelationshipsTable> = ({ data, columns, isLoading, isError }) => {
    if (isLoading) return <Loading />
    if (isError) return <Error />
    return (
        <>
            <Table columns={columns} data={data} />
            <Paginator dataLength={100} pageNumber={1} onPageChanged={() => {}} pageSize={10} />
        </>
    ) //temporary paginator component, should be replaced by pagnator wrapper
}
