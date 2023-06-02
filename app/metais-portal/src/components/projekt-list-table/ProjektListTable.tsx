import React, { useState } from 'react'

import { Paginator } from '../paginator/Paginator'

import { placeholderColumns, placeholderData } from './mockDataTable'

import { Table } from '@/components/table/Table'
import { IListView } from '@/pages/projekt/create'

interface IListTable {
    data: IListView
}

export const ListTable: React.FC<IListTable> = ({ data }) => {
    const { entityStructure, columnListData, constraintsData, tableData, unitsData, setTableParams, tableParams } = data
    const currentPage = tableParams.page
    const pageSize = tableParams.perpage
    const startData = currentPage * pageSize - pageSize

    const handlePageChange = (page: number) => {
        setTableParams((prev) => ({
            ...prev,
            page,
        }))
    }

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
