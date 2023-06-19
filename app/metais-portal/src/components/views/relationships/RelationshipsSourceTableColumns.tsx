import { ColumnDef } from '@tanstack/react-table'
import { TFunction } from 'i18next'

import { TableCols } from '../documents'

export const sourceTableColumns = (t: TFunction<'translation', undefined, 'translation'>) => {
    const columns: Array<ColumnDef<TableCols>> = [
        {
            accessorFn: (row) => row?.configurationItem?.type,
            header: t('relationshipsTab.table.source'),
            id: '0',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.configurationItem?.attributes?.Gen_Profil_nazov,
            header: t('relationshipsTab.table.sourceItemName'),
            id: '1',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.relationship?.type,
            header: t('relationshipsTab.table.relationshipType'),
            id: '3',
            cell: (row) => row.getValue() as string,
        },
        {
            accessorFn: (row) => row?.configurationItem?.metaAttributes?.state,
            header: t('relationshipsTab.table.evidenceStatus'),
            id: '4',
            cell: (row) => t(`metaAttributes.state.${row.getValue()}`) as string,
        },
    ]

    return columns
}
