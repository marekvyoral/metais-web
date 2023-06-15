import React, { useState } from 'react'
import { Table } from '@isdd/idsk-ui-kit/table/Table'

import { PaginatorWrapper } from '../paginatorWrapper/PaginatorWrapper'

import { columns } from './ciTableColumns'

import { IListData, IListFilterCallbacks } from '@/pages/projekt/index'
import { CiListFilterContainerUi, BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@/api'

interface ICiTable {
    data: IListData
    filterCallbacks: IListFilterCallbacks
    filter: CiListFilterContainerUi
}

export const CiTable: React.FC<ICiTable> = ({ data, filterCallbacks }) => {
    //they have spelling mistakes here in data
    const dataLength = data?.tableData?.pagination.totaltems ?? BASE_PAGE_SIZE
    const pageNumber = data?.tableData?.pagination.page ?? BASE_PAGE_NUMBER
    const pageSize = data?.tableData?.pagination.perPage ?? BASE_PAGE_SIZE

    const [start, setStart] = useState<number>(1)
    const [end, setEnd] = useState<number>(pageSize)

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const mapTableData = (tableData: any) => {
        return tableData?.configurationItemSet.map((item: any) => {
            const keyValue: any[] = []
            item.attributes?.forEach((a: any) => {
                keyValue.push([a?.name, a?.value])
            })
            const attributes = Object.fromEntries(keyValue)

            return { attributes, metaAttributes: { ...item.metaAttributes } }
        })
    }
    const mappedTableData = mapTableData(data?.tableData) ?? []

    const handlePageChange = (page: number, from: number, to: number) => {
        filterCallbacks.setListQueryArgs((prev) => ({
            ...prev,
            //when page: page in api changes perPage, BE mistake?
            perpage: page,
        }))
        setStart(from + 1)
        setEnd(to + 1 > dataLength ? dataLength : to + 1)
    }

    return (
        <>
            <Table columns={columns} data={mappedTableData} />
            <PaginatorWrapper paginator={{ pageNumber, pageSize, dataLength, handlePageChange }} text={{ start, end, total: dataLength }} />
        </>
    )
}
