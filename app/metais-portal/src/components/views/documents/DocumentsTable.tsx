import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'

import { NeighbourPairUi } from '@/api'

export interface TableCols extends NeighbourPairUi {
    selected?: boolean
}
interface DocumentsTable {
    data?: TableCols[]
    isLoading: boolean
    isError: boolean
    additionalColumns?: Array<ColumnDef<TableCols>>
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
}

export const DocumentsTable: React.FC<DocumentsTable> = ({ data, additionalColumns, isLoading, isError, pagination, handleFilterChange }) => {
    const { t } = useTranslation()

    const additionalColumnsNullsafe = additionalColumns ?? []
    const columns: Array<ColumnDef<TableCols>> = [
        {
            accessorFn: (row) => row.selected,
            header: () => (
                <>
                    <CheckBox label="" name="hi" id="hi" value="hi" />
                </>
            ),
            id: '0',
            cell: (row) => <CheckBox label={row.getValue() as string} name="hi" id="hi" value="hi" />,
        },
        {
            accessorFn: (row) => row?.configurationItem?.attributes?.Gen_Profil_nazov,
            header: t('documentsTab.table.name'),
            id: '1',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.configurationItem?.attributes?.Gen_Profil_poznamka,
            header: t('documentsTab.table.note'),
            id: '2',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.configurationItem?.metaAttributes?.state,
            header: t('documentsTab.table.evidenceStatus'),
            id: '3',
            cell: (row) => t(`metaAttributes.state.${row.getValue()}`) as string,
        },
        {
            accessorFn: (row) => row?.configurationItem?.metaAttributes?.createdAt,
            header: t('documentsTab.table.createdAt'),
            id: '4',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.configurationItem?.metaAttributes?.lastModifiedAt,
            header: t('documentsTab.table.lastModifiedAt'),
            id: '5',
            cell: (row) => row.getValue() as string,
        },
        ...additionalColumnsNullsafe,
    ]

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <Table columns={columns} data={data} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </QueryFeedback>
    )
}
