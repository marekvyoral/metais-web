import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'

import { TableCols } from '../documents'

export const targetTableColumns = (t: TFunction<'translation', undefined, 'translation'>) => {
    const columns: Array<ColumnDef<TableCols>> = [
        {
            accessorFn: (row) => row?.attributes?.Gen_Profil_nazov,
            header: t('relationshipsTab.table.target'),
            id: '0',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.attributes?.Gen_Profil_poznamka,
            header: t('relationshipsTab.table.targetItemName'),
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
