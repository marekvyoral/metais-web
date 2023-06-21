import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { PaginatorWrapper } from '@isdd/metais-common/paginatorWrapper/PaginatorWrapper'
import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import { IFilter } from '@isdd/idsk-ui-kit/types'

import { ColumnsOutputDefinition, mapTableData, reduceAttributesByTechnicalName, sortAndMergeCiColumns } from './ciTableHelpers'

import { IListData, IListFilterCallbacks } from '@/types/list'
import { CiListFilterContainerUi, BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@/api'

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

    let allAttributes = [...(data?.entityStructure?.attributes ?? [])]
    data?.entityStructure?.attributeProfiles?.map((attribute) => {
        allAttributes = [...allAttributes, ...(attribute?.attributes ?? [])]
    })

    const schemaAttributes = reduceAttributesByTechnicalName(data?.entityStructure)
    const tableData = mapTableData(data?.tableData, schemaAttributes, t, data?.constraintsData) ?? []

    const handlePageChange = (filter: IFilter) => {
        filterCallbacks.setListQueryArgs((prev: CiListFilterContainerUi) => ({
            ...prev,
            //when page: page in api changes perPage, BE mistake?
            perpage: filter.pageNumber,
        }))
    }

    const columnsAttributes = sortAndMergeCiColumns(data?.columnListData)

    const columnsFromApi =
        columnsAttributes?.map((attribute, index) => {
            const technicalName = attribute?.name ?? ''
            const attributeHeader = schemaAttributes[technicalName]?.name
            return {
                accessorFn: (row: ColumnsOutputDefinition) => row?.attributes?.[technicalName] ?? row?.metaAttributes?.[technicalName],
                header: attributeHeader ?? technicalName,
                id: technicalName ?? '',
                cell: (ctx: CellContext<ColumnsOutputDefinition, unknown>) =>
                    !index ? (
                        <Link to={'./' + ctx?.row?.original?.uuid}>{ctx?.getValue?.() as string}</Link>
                    ) : (
                        <strong>{ctx.getValue() as string}</strong>
                    ),
            }
        }) ?? []

    const columns: Array<ColumnDef<ColumnsOutputDefinition>> = [
        {
            accessorFn: (row) => row?.checked,
            header: () => <></>,
            id: '0',
            cell: (row) => <CheckBox label={row.getValue() as string} name="checkbox" id={row.getValue() as string} value="true" />,
        },
        ...columnsFromApi,
    ]

    return (
        <>
            <Table columns={columns} data={tableData} />
            <PaginatorWrapper pagination={{ pageNumber, pageSize, dataLength }} handlePageChange={handlePageChange} />
        </>
    )
}
