import React from 'react'
import { Table } from '@isdd/idsk-ui-kit/table/Table'

import { PaginatorWrapper } from '../paginatorWrapper/PaginatorWrapper'

import { columns } from './ciTableColumns'

import { CiListFilterContainerUi } from '@/api/generated/cmdb-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@/api/constants'
import { IListData, IListFilterCallbacks } from '@/types/list'

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

    const handlePageChange = (page?: number) => {
        filterCallbacks.setListQueryArgs((prev: CiListFilterContainerUi) => ({
            ...prev,
            //when page: page in api changes perPage, BE mistake?
            perpage: page,
        }))
    }

    return (
        <>
            <Table columns={columns} data={mappedTableData} />
            <PaginatorWrapper pagination={{ pageNumber, pageSize, dataLength }} handlePageChange={handlePageChange} />
        </>
    )
}
