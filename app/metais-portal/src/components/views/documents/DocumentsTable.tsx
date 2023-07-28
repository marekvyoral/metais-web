import { CheckBox } from '@isdd/idsk-ui-kit/checkbox/CheckBox'
import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ColumnDef, ExpandedState } from '@tanstack/react-table'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { ConfigurationItemUi, ReadCiNeighbours200 } from '@isdd/metais-common/api'
import { ExpandableRowCellWrapper } from '@isdd/idsk-ui-kit/index'

import { DocumentMetaContainer } from '@/components/containers/DocumentMetaContainer'
import { DocumentDownloadCard } from '@/components/entities/cards/DocumentDownloadCard'

export interface TableCols extends ReadCiNeighbours200 {
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
    const DMS_DOWNLOAD_FILE = `${import.meta.env.VITE_REST_CLIENT_DMS_TARGET_URL}/file/`

    const additionalColumnsNullsafe = additionalColumns ?? []

    const columns: Array<ColumnDef<TableCols>> = [
        {
            accessorFn: (row) => row.selected,
            header: () => <CheckBox label="" name="checkbox" id="checkbox-all" />,
            id: 'documentsTab.table.checkbox',
            cell: ({ row }) => (
                <ExpandableRowCellWrapper row={row}>
                    <CheckBox label="" name="checkbox" id={`checkbox_${row.id}`} />
                </ExpandableRowCellWrapper>
            ),
        },
        {
            accessorFn: (row) => row?.configurationItem,
            header: t('documentsTab.table.name'),
            id: 'documentsTab.table.name',
            cell: (row) => {
                const ci = row.getValue() as ConfigurationItemUi
                return <a href={`${DMS_DOWNLOAD_FILE}${ci?.uuid}`}>{ci?.attributes?.Gen_Profil_nazov}</a>
            },
        },
        {
            accessorFn: (row) => row?.configurationItem?.attributes?.Gen_Profil_poznamka,
            header: t('documentsTab.table.note'),
            id: 'documentsTab.table.note',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.configurationItem?.metaAttributes?.state,
            header: t('documentsTab.table.evidenceStatus'),
            id: 'documentsTab.table.evidenceStatus',
            cell: (row) => t(`metaAttributes.state.${row.getValue()}`) as string,
        },
        {
            accessorFn: (row) => row?.configurationItem?.metaAttributes?.createdAt,
            header: t('documentsTab.table.createdAt'),
            id: 'documentsTab.table.createdAt',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.configurationItem?.metaAttributes?.lastModifiedAt,
            header: t('documentsTab.table.lastModifiedAt'),
            id: 'documentsTab.table.lastModifiedAt',
            cell: (row) => row.getValue() as string,
        },
        ...additionalColumnsNullsafe,
    ]
    const [expanded, setExpanded] = useState<ExpandedState>({})

    return (
        <QueryFeedback loading={isLoading} error={isError} indicatorProps={{ layer: 'parent' }}>
            <Table
                columns={columns}
                data={data}
                expandedRowsState={expanded}
                onExpandedChange={setExpanded}
                getExpandedRow={(row) => {
                    return (
                        <DocumentMetaContainer
                            documentId={row.original?.configurationItem?.uuid}
                            View={(props) => {
                                return <DocumentDownloadCard data={props.data} isLoading={props.isLoading} isError={props.isError} />
                            }}
                        />
                    )
                }}
            />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </QueryFeedback>
    )
}
