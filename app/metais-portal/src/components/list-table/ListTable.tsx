import React, { useState } from 'react'

import { Paginator } from '../paginator/Paginator'

import { placeholderColumns, placeholderData } from './mockDataTable'

import { Table } from '@/components/table/Table'
import { IListView } from '@/pages/projekt/List'

interface IListTable {
    data: IListView
}

export const ListTable: React.FC<IListTable> = ({ data }) => {
    const { entityStructure, columnListData, constraintsData, tableData, unitsData } = data
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 7
    const startData = currentPage * pageSize - pageSize

    //to match technicalNames from AttributesProfiles and attirbutes from columns

    const columnsTechnicalNamesSorted = columnListData.attributes.sort((a, b) => a.order - b.order).map((att) => att.name)

    const usedAttributes = entityStructure.attributeProfiles
        .map((profile) =>
            profile.attributes.filter((attribute) => (columnsTechnicalNamesSorted.includes(attribute.technicalName) ? attribute : null)),
        )
        .flat(2)

    const realColumns = usedAttributes.map((attribute) => ({
        header: attribute.name,
        id: attribute.uuid,
        accessorKey: attribute.technicalName,
    }))

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
