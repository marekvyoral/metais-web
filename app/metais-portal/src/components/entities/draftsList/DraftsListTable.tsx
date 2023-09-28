import React from 'react'
import { useTranslation } from 'react-i18next'
import { PaginatorWrapper, Table } from '@isdd/idsk-ui-kit'
import { ColumnSort, IFilter, Pagination } from '@isdd/idsk-ui-kit/src/types'
import { ColumnDef } from '@tanstack/react-table'
import { ApiStandardRequestPreview } from '@isdd/metais-common/api/generated/standards-swagger'
export interface DraftsListDataGridProps {
    data: ApiStandardRequestPreview[]
    handleFilterChange: (filter: IFilter) => void
    pagination: Pagination
    sort: ColumnSort[]
}
const DraftsListDataTableGridViewForForm: React.FC<DraftsListDataGridProps> = ({ data, handleFilterChange, pagination, sort }) => {
    const { t } = useTranslation()
    const columns: Array<ColumnDef<ApiStandardRequestPreview>> = [
        {
            accessorFn: (row) => row?.srName,
            header: t('DraftsList.table.srName'),
            id: 'srName',
            cell: (row) => <span>{row?.getValue?.() as string}</span>,
        },
        {
            accessorFn: (row) => row?.workGroupId,
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
        },
        {
            accessorFn: (row) => row?.requestChannel,
            header: t('DraftsList.table.requestChannel'),
            id: 'requestChannel',
            cell: (row) => <span>{t(`DraftsList.filter.draftType.${row?.getValue?.()}`)}</span>,
        },
        {
            accessorFn: (row) => row?.standardRequestState,
            header: t('DraftsList.table.standardRequestState'),
            id: 'standardRequestState',
            cell: (row) => <span>{t(`DraftsList.filter.state.${row?.getValue?.()}`)}</span>,
        },
    ]
    return (
        <>
            <Table data={data ?? []} columns={columns} sort={sort} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </>
    )
}
export default DraftsListDataTableGridViewForForm
