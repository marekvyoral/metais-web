import React from 'react'

import { Paginator } from '../paginator/Paginator'

import { placeholderColumns, placeholderData } from './mockDataTable'

import { Table } from '@/components/table/Table'
import { IListData, IListFilterCallbacks } from '@/pages/projekt/index'

interface ICiTable {
    data: IListData
    filterCallbacks: IListFilterCallbacks
}

export const CiTable: React.FC<ICiTable> = ({ data, filterCallbacks }) => {
    const pageNumber = filterCallbacks.tableParams.pageNumber
    const pageSize = filterCallbacks.tableParams.pageSize
    const startData = pageNumber * pageSize - pageSize

    const handlePageChange = (page: number) => {
        filterCallbacks.setTableParams((prev) => ({
            ...prev,
            page,
        }))
    }

    return (
        <>
            <Table columns={placeholderColumns} data={placeholderData.slice(startData, startData + pageSize)} />
            <Paginator
                pageNumber={pageNumber}
                pageSize={pageSize}
                dataLength={placeholderData.length}
                onPageChanged={(page) => handlePageChange(page)}
            />
        </>
    )
}
