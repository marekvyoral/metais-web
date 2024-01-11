import { ColumnSort, IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api'
import { ApiIntegrationSubjectsViewList, useListIntegrationSubjects } from '@isdd/metais-common/api/generated/provisioning-swagger'
import { PROVIDING_ISVS_NAME } from '@isdd/metais-common/constants'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import React from 'react'

export type SubjectsListView = {
    isLoading: boolean
    isError: boolean
    data: ApiIntegrationSubjectsViewList | undefined
    handleFilterChange: (changedFilter: IFilter) => void
    sort: ColumnSort[]
}

type Props = {
    View: React.FC<SubjectsListView>
    entityId: string
}

export const IntegrationSubjectsListContainer: React.FC<Props> = ({ View, entityId }) => {
    const { filter, handleFilterChange } = useFilterParams<IFilter>({})

    const { data, isLoading, isError, fetchStatus } = useListIntegrationSubjects(
        {
            integrationUuid: entityId,
            page: filter.pageNumber ?? BASE_PAGE_NUMBER,
            perPageSize: filter.pageSize ?? BASE_PAGE_SIZE,
            sortBy: filter?.sort?.[0]?.orderBy ?? PROVIDING_ISVS_NAME,
            ascending: filter?.sort?.[0]?.sortDirection === SortType.ASC,
        },
        { query: { enabled: !!entityId } },
    )
    return (
        <View
            data={data}
            isError={isError}
            isLoading={isLoading && fetchStatus != 'idle'}
            handleFilterChange={handleFilterChange}
            sort={filter.sort ?? []}
        />
    )
}
