import { CheckBox } from '@isdd/idsk-ui-kit/index'
import { CHECKBOX_CELL } from '@isdd/idsk-ui-kit/table/constants'
import { ApiStandardRequestPreview } from '@isdd/metais-common/api/generated/standards-swagger'
import { ColumnDef, Row } from '@tanstack/react-table'
import { TFunction } from 'i18next'

export const standardRequestsListColumns = (
    t: TFunction,
    handleRowCheckBoxChanged: (row: Row<ApiStandardRequestPreview>) => void,
    selectedRowId?: number,
): Array<ColumnDef<ApiStandardRequestPreview>> => {
    const columns: Array<ColumnDef<ApiStandardRequestPreview>> = [
        {
            header: '',
            accessorFn: (row) => row?.srName,
            enableSorting: true,
            id: CHECKBOX_CELL,
            size: 50,
            cell: ({ row }) => {
                return (
                    <>
                        <div className="govuk-checkboxes govuk-checkboxes--small">
                            <CheckBox
                                label=""
                                name="checkbox"
                                id={`checkbox_${row.id}`}
                                value="true"
                                onChange={() => {
                                    handleRowCheckBoxChanged(row)
                                }}
                                checked={row.original.id == selectedRowId}
                            />
                        </div>
                    </>
                )
            },
        },
        {
            header: t('votes.voteEdit.standardRequestsTable.srName'),
            accessorFn: (row) => row?.srName,
            enableSorting: true,
            id: 'srName',
            size: 300,
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
            cell: (ctx) => <span> {ctx?.getValue?.() as string} </span>,
        },
        {
            header: t('votes.voteEdit.standardRequestsTable.createdAt'),
            accessorFn: (row) => row?.createdAt,
            enableSorting: true,
            id: 'createdAt',
            size: 150,
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
            cell: (ctx) => <span> {ctx?.getValue?.() as string} </span>,
        },
        {
            header: t('votes.voteEdit.standardRequestsTable.name'),
            accessorFn: (row) => row?.name,
            enableSorting: true,
            id: 'name',
            size: 100,
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
            cell: (ctx) => <span> {ctx?.getValue?.() as string} </span>,
        },
        {
            header: t('votes.voteEdit.standardRequestsTable.version'),
            accessorFn: (row) => row?.requestChannel,
            enableSorting: true,
            id: 'version',
            size: 100,
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
            cell: (ctx) => <span> {ctx?.getValue?.() as string} </span>,
        },
        {
            header: t('votes.voteEdit.standardRequestsTable.standardRequestState'),
            accessorFn: (row) => row?.standardRequestState,
            enableSorting: true,
            id: 'standardRequestState',
            size: 100,
            meta: { getCellContext: (ctx) => ctx?.getValue?.() },
            cell: (ctx) => <span> {ctx?.getValue?.() as string} </span>,
        },
    ]

    return columns
}
