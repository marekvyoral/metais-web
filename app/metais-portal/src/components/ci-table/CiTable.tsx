import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table } from '@isdd/idsk-ui-kit/table/Table'

import { PaginatorWrapper } from '../paginatorWrapper/PaginatorWrapper'

import { ColumnsOutputDefinition, createColumnsData } from './ciTableColumns'

import { CiListFilterContainerUi, BASE_PAGE_NUMBER, BASE_PAGE_SIZE, ConfigurationItemUi, ConfigurationItemSetUi } from '@/api'
import { IListData, IListFilterCallbacks } from '@/types/list'
import { pairEnumsToEnumValues } from '@/componentHelpers'

interface ICiTable {
    data: IListData
    filterCallbacks: IListFilterCallbacks
    filter: CiListFilterContainerUi
}

export const CiTable: React.FC<ICiTable> = ({ data, filterCallbacks }) => {
    const { t } = useTranslation()
    //they have spelling mistakes here in data
    const dataLength = data?.tableData?.pagination?.totaltems ?? BASE_PAGE_SIZE
    const pageNumber = data?.tableData?.pagination?.page ?? BASE_PAGE_NUMBER
    const pageSize = data?.tableData?.pagination?.perPage ?? BASE_PAGE_SIZE

    const [start, setStart] = useState<number>(1)
    const [end, setEnd] = useState<number>(pageSize)
    let allAttributes = [...(data?.entityStructure?.attributes ?? [])]
    data?.entityStructure?.attributeProfiles?.map((attribute) => {
        allAttributes = [...allAttributes, ...(attribute?.attributes ?? [])]
    })

    const mapTableData = (tableData: ConfigurationItemSetUi | undefined | void) => {
        return (tableData?.configurationItemSet?.map((confItem: ConfigurationItemUi) => {
            const newAttributes: { [attributeName: string]: string } = {}
            Object.keys(confItem?.attributes ?? {})?.map((attributeName: string) => {
                const foundAttrWithTypes = allAttributes?.find((attr) => attr?.technicalName === attributeName)
                const newRowValue = pairEnumsToEnumValues(foundAttrWithTypes, confItem, data?.constraintsData ?? [], t, false)
                newAttributes[attributeName] = newRowValue
            })

            return { ...confItem, attributes: newAttributes }
        }) ?? []) as ColumnsOutputDefinition[]
    }
    const mappedTableData = mapTableData(data?.tableData) ?? []

    const handlePageChange = (page: number, from: number, to: number) => {
        filterCallbacks.setListQueryArgs((prev: CiListFilterContainerUi) => ({
            ...prev,
            //when page: page in api changes perPage, BE mistake?
            page,
        }))
        setStart(from + 1)
        setEnd(to + 1 > dataLength ? dataLength : to + 1)
    }

    const columnsAttributes = data?.columnListData?.attributes
    const columnsMetaAttributes = data?.columnListData?.metaAttributes
    const newColums = createColumnsData(columnsAttributes, columnsMetaAttributes, allAttributes)

    return (
        <>
            <Table columns={newColums} data={mappedTableData} />
            <PaginatorWrapper paginator={{ pageNumber, pageSize, dataLength, handlePageChange }} text={{ start, end, total: dataLength }} />
        </>
    )
}
