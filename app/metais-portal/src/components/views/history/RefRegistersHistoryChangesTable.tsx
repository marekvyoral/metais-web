import { PaginatorWrapper } from '@isdd/idsk-ui-kit/paginatorWrapper/PaginatorWrapper'
import { Table } from '@isdd/idsk-ui-kit/table/Table'
import { IFilter, Pagination } from '@isdd/idsk-ui-kit/types'
import { ATTRIBUTE_NAME, BulkPopup, DMS_DOWNLOAD_FILE, QueryFeedback } from '@isdd/metais-common/index'
import { HistoryVersionUiConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ButtonLink } from '@isdd/idsk-ui-kit/index'

import { downloadFile } from '@/components/views/documents/utils'

interface IRefRegistersHistoryChangesTable {
    data?: HistoryVersionUiConfigurationItemUi[]
    isLoading: boolean
    isError: boolean
    additionalColumns?: Array<ColumnDef<HistoryVersionUiConfigurationItemUi>>
    pagination: Pagination
    handleFilterChange: (filter: IFilter) => void
}

export const RefRegistersHistoryChangesTable: React.FC<IRefRegistersHistoryChangesTable> = ({
    data,
    additionalColumns,
    isLoading,
    isError,
    pagination,
    handleFilterChange,
}) => {
    const { t } = useTranslation()

    const additionalColumnsNullsafe = additionalColumns ?? []
    const columns: Array<ColumnDef<HistoryVersionUiConfigurationItemUi>> = [
        {
            accessorFn: (row) => row?.actionTime,
            header: t('historyTab.table.actionTime'),
            id: '1',
            cell: (row) => new Date(row.getValue() as string).toLocaleString(),
        },
        {
            accessorFn: (row) => row?.item?.attributes?.[ATTRIBUTE_NAME.ReferenceRegisterHistory_Profile_stav],
            header: t('historyTab.table.targetStatus'),
            id: '2',
            cell: (row) => t(`refRegisters.table.state.${row?.getValue()}`),
        },
        {
            accessorFn: (row) => row?.item?.attributes?.[ATTRIBUTE_NAME.ReferenceRegisterHistory_Profile_popis],
            header: t('historyTab.table.note'),
            id: '3',
            meta: {
                getCellContext: (ctx) => ctx?.getValue?.(),
            },
            cell: (row) => row?.getValue(),
        },
        {
            accessorFn: (row) => row?.item?.attributes?.[ATTRIBUTE_NAME.ReferenceRegisterHistory_Profile_prilohy],
            header: t('historyTab.table.attachements'),
            id: '4',
            cell: (row) => {
                const allDocuments = (row?.getValue() as string[]) ?? []
                if (allDocuments?.length > 0)
                    return (
                        <BulkPopup
                            label={t('actionOverTable.options.title')}
                            items={() => [
                                <ButtonLink
                                    key={'buttonDownload'}
                                    label={t('actionOverTable.options.download')}
                                    onClick={() => {
                                        allDocuments?.map((docId) => downloadFile(`${DMS_DOWNLOAD_FILE}${docId}`, docId))
                                    }}
                                />,
                            ]}
                        />
                    )
                return <></>
            },
        },

        ...additionalColumnsNullsafe,
    ]

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <Table columns={columns} data={data} />
            <PaginatorWrapper {...pagination} handlePageChange={handleFilterChange} />
        </QueryFeedback>
    )
}
