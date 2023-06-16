import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { Pagination } from '@isdd/idsk-ui-kit/types'

import { TableCols } from '../documents'

import { PaginatorWrapper } from '@/components/paginatorWrapper/PaginatorWrapper'

interface RelationshipsTable {
    data?: TableCols[] //missing return types from orval, types should come from backend, not from _GeneratedType file
    isLoading: boolean
    isError: boolean
    columns: Array<ColumnDef<TableCols>>
    pagination: Pagination
    handleFilterChange: (pageNumber?: number, pageSize?: number, sortBy?: string, sortSource?: string, sortType?: string) => void
}

const Loading: React.FC = () => {
    return <div>loading</div>
}

const Error: React.FC = () => {
    return <div>error</div>
}

export const RelationshipsTable: React.FC<RelationshipsTable> = ({ data, columns, isLoading, isError, pagination, handleFilterChange }) => {
    if (isLoading) return <Loading />
    if (isError) return <Error />
    return (
        <>
            <Table columns={columns} data={data} />
            <PaginatorWrapper pagination={pagination} handlePageChange={handleFilterChange} />
        </>
    ) //temporary paginator component, should be replaced by pagnator wrapper
}
