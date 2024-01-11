import React from 'react'
import { PaginatorWrapper, Table } from '@isdd/idsk-ui-kit/index'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { ColumnDef } from '@tanstack/react-table'
import { ApiIntegrationCoverageOfIsvsViewItem } from '@isdd/metais-common/api/generated/provisioning-swagger'
import { useTranslation } from 'react-i18next'
import { QueryFeedback } from '@isdd/metais-common/index'
import { ENTITY_AS } from '@isdd/metais-common/constants'

import { KsAsListView } from '@/components/containers/IntegrationKsAsListContainer'
import { IntegrationColumnsConfig, getColumnsForIntegrationTables } from '@/componentHelpers/ci/ciTableHelpers'

const ColumnsConfig: IntegrationColumnsConfig[] = [
    {
        id: 'consumingAsCode',
        technicalName: 'consumingAs',
        entity: ENTITY_AS,
        isCode: true,
    },
    {
        id: 'consumingAsName',
        technicalName: 'consumingAs',
        entity: ENTITY_AS,
    },
    {
        id: 'providingAsCode',
        technicalName: 'providingAs',
        entity: ENTITY_AS,
        isCode: true,
    },
    {
        id: 'providingAsName',
        technicalName: 'providingAs',
        entity: ENTITY_AS,
    },
]

export const IntegrationKsAsListView: React.FC<KsAsListView> = ({ isError, isLoading, data, handleFilterChange, sort }) => {
    const { t } = useTranslation()
    const columns: Array<ColumnDef<ApiIntegrationCoverageOfIsvsViewItem>> = getColumnsForIntegrationTables(ColumnsConfig, t)

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
