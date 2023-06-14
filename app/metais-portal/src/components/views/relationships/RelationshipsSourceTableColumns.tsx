import React from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { TableCols } from '../documents'

export const sourceTableColumns = () => {
    const { t } = useTranslation()

    const columns: Array<ColumnDef<TableCols>> = [
        {
            accessorFn: (row) => row?.attributes?.Gen_Profil_nazov,
            header: t('relationshipsTab.table.source'),
            id: '0',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.attributes?.Gen_Profil_poznamka,
            header: t('relationshipsTab.table.sourceItemName'),
            id: '1',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.metaAttributes?.state,
            header: t('relationshipsTab.table.relationshipType'),
            id: '3',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.metaAttributes?.createdAt,
            header: t('relationshipsTab.table.evidenceStatus'),
            id: '4',
            cell: (row) => row.getValue() as string,
        },
    ]

    return columns
}
