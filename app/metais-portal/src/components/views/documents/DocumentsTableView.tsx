import React from 'react'
import { Table } from '@/components/table/Table'
import { ColumnDef } from '@tanstack/react-table'
import { CheckBox } from '@/components/CheckBox'
import { Paginator } from '@/components/paginator/Paginator'
import { useTranslation } from 'react-i18next'

interface TableCols {
    attributes: any
    metaAttributes: any
    selected: boolean
}
interface DocumentsTable {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    data: any //todo: missing return types from orval
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

export const DocumentsTableView: React.FC<DocumentsTable> = ({ data, additionalColumns, isLoading, isError }) => {
    if (isLoading) return <Loading />
    if (isError) return <Error />

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
            <Paginator dataLength={100} pageNumber={1} onPageChanged={() => {}} pageSize={10} />
        </>
    ) //todo: paginator wrapper
}
