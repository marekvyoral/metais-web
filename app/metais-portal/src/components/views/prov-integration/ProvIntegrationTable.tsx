import { PaginatorWrapper, Table, TextBody } from '@isdd/idsk-ui-kit/index'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { ApiIntegrationLink } from '@isdd/metais-common/api/generated/provisioning-swagger'
import { CellContext, ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { ColumnSort, IFilter } from '@isdd/idsk-ui-kit/types'
import { useTranslation } from 'react-i18next'
import { Languages } from '@isdd/metais-common/localization/languages'

import { IProvIntegrationData } from '@/components/containers/ProvIntegrationListContainer'

type Props = {
    data: IProvIntegrationData
    handleFilterChange: (changedFilter: IFilter) => void
    sort: ColumnSort[]
}

enum ColumnNames {
    integrationName = 'integName',
    consumingProjects = 'consumingProjName',
    providingProjects = 'providingProjName',
    dizState = 'dizStatus',
}

export const ProvIntegrationTable: React.FC<Props> = ({ data, handleFilterChange, sort }) => {
    const { t, i18n } = useTranslation()
    const { listIntegrationLinks, dizStateData } = data
    const columns: Array<ColumnDef<ApiIntegrationLink>> = [
        {
            accessorKey: ColumnNames.integrationName,
            header: () => {
                return <span>{t('integrationLinks.columns.integName')}</span>
            },
            id: ColumnNames.integrationName,
            size: 200,
            cell: (ctx: CellContext<ApiIntegrationLink, unknown>) => (
                <TextBody size="S" className={'marginBottom0'}>
                    {ctx.row.original.name}
                </TextBody>
            ),
            meta: {
                getCellContext: (ctx: CellContext<ApiIntegrationLink, unknown>) => ctx.row.original.name,
            },
            enableSorting: true,
        },
        {
            accessorKey: ColumnNames.providingProjects,
            header: () => {
                return <span>{t('integrationLinks.columns.providingProjName')}</span>
            },
            id: ColumnNames.providingProjects,
            size: 200,
            cell: (ctx: CellContext<ApiIntegrationLink, unknown>) => (
                <TextBody size="S" className={'marginBottom0'}>
                    {ctx.row.original.providingProject?.name}
                </TextBody>
            ),
            meta: {
                getCellContext: (ctx: CellContext<ApiIntegrationLink, unknown>) => ctx.row.original.providingProject?.name,
            },
            enableSorting: true,
        },
        {
            accessorKey: ColumnNames.consumingProjects,
            header: () => {
                return <span>{t('integrationLinks.columns.consumingProjName')}</span>
            },
            id: ColumnNames.consumingProjects,
            size: 200,
            cell: (ctx: CellContext<ApiIntegrationLink, unknown>) => (
                <TextBody size="S" className={'marginBottom0'}>
                    {ctx.row.original.consumingProject?.name}
                </TextBody>
            ),
            meta: {
                getCellContext: (ctx: CellContext<ApiIntegrationLink, unknown>) => ctx.row.original.consumingProject?.name,
            },
            enableSorting: true,
        },
        {
            accessorKey: ColumnNames.dizState,
            header: () => {
                return <span>{t('integrationLinks.columns.dizStatus')}</span>
            },
            id: ColumnNames.dizState,
            size: 200,
            cell: (ctx: CellContext<ApiIntegrationLink, unknown>) => {
                const dizStateEnum = dizStateData?.enumItems?.find((item) => item.code === ctx.row.original.dizStatus)
                return (
                    <TextBody size="S" className={'marginBottom0'}>
                        {i18n.language === Languages.SLOVAK ? dizStateEnum?.description : dizStateEnum?.engDescription}
                    </TextBody>
                )
            },
            meta: {
                getCellContext: (ctx: CellContext<ApiIntegrationLink, unknown>) => {
                    const dizStateEnum = dizStateData?.enumItems?.find((item) => item.code === ctx.row.original.dizStatus)
                    return i18n.language === Languages.SLOVAK ? dizStateEnum?.description : dizStateEnum?.engDescription
                },
            },
            enableSorting: true,
        },
    ]

    return (
        <>
            <Table
                columns={columns}
                data={listIntegrationLinks?.results}
                rowHref={(row) => `/prov-integration/detail/${row?.original?.uuid}`}
                onSortingChange={(newSort) => {
                    handleFilterChange({ sort: newSort })
                }}
                sort={sort}
                manualSorting
            />
            <PaginatorWrapper
                pageNumber={listIntegrationLinks?.pagination?.page ?? BASE_PAGE_NUMBER}
                pageSize={listIntegrationLinks?.pagination?.perPage ?? BASE_PAGE_SIZE}
                dataLength={listIntegrationLinks?.pagination?.totalItems ?? 0}
                handlePageChange={handleFilterChange}
            />
        </>
    )
}
