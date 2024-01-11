import React from 'react'
import { PaginatorWrapper, Table } from '@isdd/idsk-ui-kit/index'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { ColumnDef } from '@tanstack/react-table'
import { ApiIntegrationSubjectsViewItem } from '@isdd/metais-common/api/generated/provisioning-swagger'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { ENTITY_ISVS, ENTITY_PROJECT, PO } from '@isdd/metais-common/constants'

import { SubjectsListView } from '@/components/containers/IntegrationSubjectsListContainer'
import { IntegrationColumnsConfig, getColumnsForIntegrationTables } from '@/componentHelpers/ci/ciTableHelpers'

const ColumnsConfig: IntegrationColumnsConfig[] = [
    {
        id: 'consuminGestorName',
        technicalName: 'consumingGestor',
        entity: PO,
    },
    {
        id: 'consumingIsvsName',
        technicalName: 'consumingIsvs',
        entity: ENTITY_ISVS,
    },
    {
        id: 'consumingProjName',
        technicalName: 'consumingProject',
        entity: ENTITY_PROJECT,
    },
    {
        id: 'providingGestorName',
        technicalName: 'providingGestor',
        entity: PO,
    },
    {
        id: 'providingIsvsName',
        technicalName: 'providingIsvs',
        entity: ENTITY_ISVS,
    },
    {
        id: 'providingProjName',
        technicalName: 'providingProject',
        entity: ENTITY_PROJECT,
    },
]

export const IntegrationSubjectsListView: React.FC<SubjectsListView> = ({ isError, isLoading, data, handleFilterChange, sort }) => {
    const { t } = useTranslation()
    const columns: Array<ColumnDef<ApiIntegrationSubjectsViewItem>> = getColumnsForIntegrationTables(ColumnsConfig, t)

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <Table
                columns={columns}
                data={data?.results}
                onSortingChange={(newSort) => {
                    handleFilterChange({ sort: newSort })
                }}
                sort={sort}
                isLoading={isLoading}
                error={isError}
                manualSorting
            />
            <PaginatorWrapper
                pageNumber={data?.pagination?.page ?? BASE_PAGE_NUMBER}
                pageSize={data?.pagination?.perPage ?? BASE_PAGE_SIZE}
                dataLength={data?.pagination?.totalItems ?? 0}
                handlePageChange={handleFilterChange}
            />
        </QueryFeedback>
    )
}
