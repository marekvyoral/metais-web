import React from 'react'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit'

import { ColumnsOutputDefinition, mapTableData, reduceAttributesByTechnicalName, sortAndMergeCiColumns } from './ciTableHelpers'

import { IListData } from '@/types/list'

interface ICiTable {
    data: IListData
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
}

export const CiTable: React.FC<ICiTable> = ({ data, pagination, handleFilterChange }) => {
    const { t } = useTranslation()

    const schemaAttributes = reduceAttributesByTechnicalName(data?.entityStructure)
    const tableData = mapTableData(data?.tableData, schemaAttributes, t, data?.constraintsData) ?? []

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
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </>
    )
}
