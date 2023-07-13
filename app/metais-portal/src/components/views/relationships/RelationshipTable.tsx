import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { QueryFeedback } from '@isdd/metais-common/index'

import { TableCols } from '../documents'

interface RelationshipsTable {
    data?: TableCols[] //missing return types from orval, types should come from backend, not from _GeneratedType file
    isLoading: boolean
    isError: boolean
    columns: Array<ColumnDef<TableCols>>
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
}

export const RelationshipsTable: React.FC<RelationshipsTable> = ({ data, columns, isLoading, isError, pagination, handleFilterChange }) => {
    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <Table columns={columns} data={data} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </QueryFeedback>
    )
}
