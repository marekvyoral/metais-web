import React from 'react'
import { useTranslation } from 'react-i18next'
import { PaginatorWrapper, Table } from '@isdd/idsk-ui-kit'
import { ColumnDef } from '@tanstack/react-table'
import { ApiStandardRequestPreview } from '@isdd/metais-common/api/generated/standards-swagger'

import { IDraftsListTable } from '@/types/views'

const DraftsListDataTableGridViewForForm: React.FC<IDraftsListTable> = ({ data, handleFilterChange, pagination, sort }) => {
    const { t } = useTranslation()
    const columns: Array<ColumnDef<ApiStandardRequestPreview>> = [
        {
            accessorFn: (row) => row?.srName,
            header: t('DraftsList.table.srName'),
            id: 'srName',
            cell: (row) => <span>{row?.getValue?.() as string}</span>,
            enableSorting: true,
        },
        {
            accessorFn: (row) => data?.workingGroups?.find((workingGroup) => workingGroup?.uuid === row?.workGroupId)?.shortName ?? '',
            header: t('DraftsList.table.workGroup'),
            id: 'workGroup',
            cell: (row) => <span>{row?.getValue?.() as string}</span>,
        },
        {
            accessorFn: (row) => row?.createdAt,
            header: t('DraftsList.table.createdAt'),
            id: 'createdAt',
            cell: (row) => <span>{t('dateTime', { date: row.getValue() })}</span>,
        },
        {
            accessorFn: (row) => row?.name,
            header: t('DraftsList.table.name'),
            id: 'name',
            cell: (row) => <span>{row?.getValue?.() as string}</span>,
            enableSorting: true,
        },
        {
            accessorFn: (row) => row?.requestChannel,
            header: t('DraftsList.table.requestChannel'),
            id: 'requestChannel',
            cell: (row) => <span>{t(`DraftsList.filter.draftType.${row?.getValue?.()}`)}</span>,
            enableSorting: true,
        },
        {
            accessorFn: (row) => row?.standardRequestState,
            header: t('DraftsList.table.standardRequestState'),
            id: 'standardRequestState',
            cell: (row) => <span>{t(`DraftsList.filter.state.${row?.getValue?.()}`)}</span>,
            enableSorting: true,
        },
    ]
    return (
        <>
            <Table data={data?.draftsList ?? []} columns={columns} sort={sort} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </>
    )
}
export default DraftsListDataTableGridViewForForm
