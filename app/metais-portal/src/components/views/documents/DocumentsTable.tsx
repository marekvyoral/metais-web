import React from 'react'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { ColumnDef } from '@tanstack/react-table'
import { Paginator } from '@isdd/idsk-ui-kit/paginator/Paginator'
import { useTranslation } from 'react-i18next'

import { CheckBox } from '@/components/CheckBox'
import { ConfigurationItemMapped } from '@/api/types/ReadCiNeighboursUsingPOST200_GeneratedType'

export interface TableCols extends ConfigurationItemMapped {
    selected?: boolean
}
interface DocumentsTable {
    data?: TableCols[] //missing return types from orval, types should come from backend, not from _GeneratedType file
    isLoading: boolean
    isError: boolean
    additionalColumns?: Array<ColumnDef<TableCols>>
}

const Loading: React.FC = () => {
    return <div>loading</div>
}

const Error: React.FC = () => {
    return <div>error</div>
}

export const DocumentsTable: React.FC<DocumentsTable> = ({ data, additionalColumns, isLoading, isError }) => {
    const { t } = useTranslation()

    if (isLoading) return <Loading />
    if (isError) return <Error />

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
            accessorFn: (row) => row?.attributes?.Gen_Profil_nazov,
            header: t('documentsTab.table.name'),
            id: '1',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.attributes?.Gen_Profil_poznamka,
            header: t('documentsTab.table.note'),
            id: '2',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.metaAttributes?.state,
            header: t('documentsTab.table.evidenceStatus'),
            id: '3',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.metaAttributes?.createdAt,
            header: t('documentsTab.table.createdAt'),
            id: '4',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.metaAttributes?.lastModifiedAt,
            header: t('documentsTab.table.lastModifiedAt'),
            id: '5',
            cell: (row) => row.getValue() as string,
        },
        ...additionalColumnsNullsafe,
    ]

    return (
        <>
            <Table columns={columns} data={data} />
            <Paginator
                dataLength={100}
                pageNumber={1}
                onPageChanged={() => {
                    //this is a dummy method
                }}
                pageSize={10}
            />
        </>
    )
    //temporary paginator component, should be replaced by pagnator wrapper
}
