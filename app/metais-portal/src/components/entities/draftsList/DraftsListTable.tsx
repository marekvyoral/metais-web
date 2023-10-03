import React from 'react'
import { useTranslation } from 'react-i18next'
import { PaginatorWrapper, Table } from '@isdd/idsk-ui-kit'
import { ColumnDef } from '@tanstack/react-table'
import { ApiStandardRequestPreview } from '@isdd/metais-common/api/generated/standards-swagger'
import { Link, useLocation } from 'react-router-dom'

import { IDraftsListTable } from '@/types/views'

const DraftsListDataTableGridViewForForm: React.FC<IDraftsListTable> = ({ data, handleFilterChange, pagination, sort }) => {
    const { t } = useTranslation()
    const location = useLocation()

    const columns: Array<ColumnDef<ApiStandardRequestPreview>> = [
        {
            accessorFn: (row) => row,
            header: t('DraftsList.table.srName'),
            id: 'srName',
            cell: (row) => (
                <Link to={'./' + row.row.original?.id ?? ''} state={{ from: location }} className="govuk-link">
                    {row.row.original?.srName as string}
                </Link>
            ),
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
            enableSorting: true,
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
            id: 'standardState.description',
            cell: (row) => <span>{t(`DraftsList.filter.state.${row?.getValue?.()}`)}</span>,
            enableSorting: true,
        },
    ]
    return (
        <>
            <Table
                data={data?.draftsList ?? []}
                columns={columns}
                sort={sort}
                onSortingChange={(newSort) => {
                    handleFilterChange({ sort: newSort })
                }}
            />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </>
    )
}
export default DraftsListDataTableGridViewForForm
