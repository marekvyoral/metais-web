import React, { useState } from 'react'

import { PaginatorWrapper } from '../paginatorWrapper/PaginatorWrapper'

import { placeholderColumns, placeholderData } from './mockDataTable'

import { Table } from '@/components/table/Table'
import { IListData, IListFilterCallbacks } from '@/pages/projekt/index'
import { IListQueryArgs } from '@/api/TableApi'

interface ICiTable {
    data: IListData
    filterCallbacks: IListFilterCallbacks
    filter: IListQueryArgs
}

export const CiTable: React.FC<ICiTable> = ({ data, filterCallbacks, filter }) => {
    const pageNumber = filter.pageNumber
    const pageSize = filter.pageSize
    const startData = pageNumber * pageSize - pageSize
    const dataLength = placeholderData.length

    const [start, setStart] = useState<number>(1)
    const [end, setEnd] = useState<number>(pageSize)

    const handlePageChange = (page: number, from: number, to: number) => {
        filterCallbacks.setListQueryArgs((prev) => ({
            ...prev,
            pageNumber: page,
        }))
        setStart(from + 1)
        setEnd(to + 1 > dataLength ? dataLength : to + 1)
    }

    return (
        <>
            <Table columns={placeholderColumns} data={placeholderData.slice(startData, startData + pageSize)} />
            <PaginatorWrapper paginator={{ pageNumber, pageSize, dataLength, handlePageChange }} text={{ start, end, total: dataLength }} />
        </>
    )
}
