import { ExpandableRowCellWrapper, PaginatorWrapper, Table } from '@isdd/idsk-ui-kit/index'
import { ApiReferenceRegisterItem } from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { ColumnDef, ExpandedState } from '@tanstack/react-table'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { RefRegisterItemView } from '@/components/views/refregisters/RefRegisterItemView'
import { IRefRegisterItemsView } from '@/types/views'

export const RefRegistersItemTable = ({
    data: { refRegisterItems, referenceRegisterItemAttributes },
    handleFilterChange,
    pagination,
    isLoading,
    isError,
}: IRefRegisterItemsView) => {
    const { t } = useTranslation()
    const [expanded, setExpanded] = useState<ExpandedState>({})

    const columns: Array<ColumnDef<ApiReferenceRegisterItem>> = [
        {
            accessorFn: (row) => row?.order,
            header: t('refRegisters.detail.items.order'),
            id: '1',
            cell: ({ row }) => <ExpandableRowCellWrapper row={row}>{row?.original?.order}</ExpandableRowCellWrapper>,
            size: 200,
        },
        {
            accessorFn: (row) => row?.itemName,
            header: t('refRegisters.detail.items.itemName'),
            id: '2',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (row) => row?.getValue(),
            size: 200,
        },
        {
            accessorFn: (row) => row?.referenceRegisterGroup?.groupName,
            header: t('refRegisters.detail.items.group'),
            id: '3',
            cell: (row) => row.getValue(),
            size: 200,
        },
        {
            accessorFn: (row) => row?.referenceRegisterSubGroup?.groupName,
            header: t('refRegisters.detail.items.subGroup'),
            id: '4',
            cell: (row) => row.getValue(),
            size: 200,
        },
        {
            accessorFn: (row) => row?.subjectIdentification,
            header: t('refRegisters.detail.items.subjectIdentification'),
            id: '5',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (row) => row?.getValue(),
            size: 200,
        },
        {
            accessorFn: (row) => row?.refID,
            header: t('refRegisters.detail.items.refID'),
            id: '6',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (row) => row?.getValue(),
            size: 200,
        },
        {
            accessorFn: (row) => row?.dataElementRefID,
            header: t('refRegisters.detail.items.dataElementRefID'),
            id: '7',
            cell: (row) => row?.getValue(),
            size: 200,
        },
        {
            accessorFn: (row) => row?.note,
            header: t('refRegisters.detail.items.note'),
            id: '8',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (row) => row?.getValue(),
            size: 200,
        },
    ]

    return (
        <>
            <Table
                columns={columns}
                data={refRegisterItems?.apiReferenceRegisterItems}
                expandedRowsState={expanded}
                onExpandedChange={setExpanded}
                getExpandedRow={(row) => {
                    return <RefRegisterItemView row={row?.original} referenceRegisterItemAttributes={referenceRegisterItemAttributes} />
                }}
                error={isError}
                isLoading={isLoading}
            />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </>
    )
}
