import React from 'react'

import { Paginator } from '../paginator/Paginator'

import { placeholderColumns, placeholderData } from './mockDataTable'

import { Table } from '@/components/table/Table'
import { IListData, IListFilterCallbacks } from '@/pages/projekt/index'

interface IListTable {
    data: IListData
    filterCallbacks: IListFilterCallbacks
}

export const ProjektListTable: React.FC<IListTable> = ({ data, filterCallbacks }) => {
    const currentPage = filterCallbacks.tableParams.page
    const pageSize = filterCallbacks.tableParams.perpage
    const startData = currentPage * pageSize - pageSize

    const handlePageChange = (page: number) => {
        filterCallbacks.setTableParams((prev) => ({
            ...prev,
            page,
        }))
    }

    /*
        tableData returns 
        current page, perPage, totalPages, totalItems
    */

    return (
        <>
            <Table columns={placeholderColumns} data={placeholderData.slice(startData, startData + pageSize)} />
            <Paginator
                pageNumber={currentPage}
                pageSize={pageSize}
                dataLength={placeholderData.length}
                onPageChanged={(page) => handlePageChange(page)}
            />
        </>
    )
}
