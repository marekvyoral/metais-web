import React, { useState } from 'react'

import { Paginator } from '../paginator/Paginator'

import { placeholderColumns, placeholderData } from './mockDataTable'

import { Table } from '@/components/table/Table'
import { IListView } from '@/pages/projekt/create'

interface IListTable {
    data: IListView
}

export const ListTable: React.FC<IListTable> = ({ data }) => {
    const { entityStructure, columnListData, constraintsData, tableData, unitsData } = data
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 7
    const startData = currentPage * pageSize - pageSize

    return (
        <>
            <Table columns={placeholderColumns} data={placeholderData.slice(startData, startData + pageSize)} />
            <Paginator
                pageNumber={currentPage}
                pageSize={pageSize}
                dataLength={placeholderData.length}
                onPageChanged={(page) => setCurrentPage(page)}
            />
        </>
    )
}
