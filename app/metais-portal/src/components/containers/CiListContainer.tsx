import { useGetRoleParticipantBulk, useReadCiList1 } from '@isdd/metais-common/api'
import { useFilterForCiList, useGetColumnData, usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { mapFilterParamsToApi } from '@isdd/metais-common/componentHelpers/filter'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryFeedback } from '@isdd/metais-common/index'
import { IListView } from '@isdd/metais-common/types/list'
import React from 'react'
import { FieldValues } from 'react-hook-form'
interface ICiListContainer<T> {
    entityName: string
    ListComponent: React.FC<IListView>
    defaultFilterValues: T
    defaultFilterOperators?: T
}

export const CiListContainer = <T extends FieldValues & IFilterParams>({
    entityName,
    ListComponent,
    defaultFilterValues,
    defaultFilterOperators,
}: ICiListContainer<T>) => {
    const { columnListData, saveColumnSelection, resetColumns, isLoading: isColumnsLoading, isError: isColumnsError } = useGetColumnData(entityName)

    const defaultRequestApi = {
        filter: {
            type: [entityName],
            metaAttributes: {
                state: ['DRAFT'],
            },
        },
    }

    const { filterToNeighborsApi, filterParams, handleFilterChange } = useFilterForCiList(defaultFilterValues, entityName, defaultRequestApi)

    const {
        data: tableData,
        isLoading: isReadCiListLoading,
        isError: isReadCiListError,
    } = useReadCiList1({
        ...filterToNeighborsApi,
        filter: {
            ...filterToNeighborsApi.filter,
            fullTextSearch: filterParams.fullTextSearch || '',
            attributes: mapFilterParamsToApi(filterParams, defaultFilterOperators),
        },
    })

    const ownerGids = new Set(tableData?.configurationItemSet?.map((item) => item.metaAttributes?.owner ?? ''))
    const {
        data: gestorsData,
        isLoading: isGestorsLoading,
        isError: isGestorsError,
        fetchStatus,
    } = useGetRoleParticipantBulk({ gids: [...ownerGids] }, { query: { enabled: !!tableData && ownerGids && [...ownerGids]?.length > 0 } })

    const pagination = usePagination(tableData, filterParams)

    const isGestorsLoadingCombined = isGestorsLoading && fetchStatus != 'idle'
    const isLoading = [isReadCiListLoading, isColumnsLoading, isGestorsLoadingCombined].some((item) => item)
    const isError = [isReadCiListError, isColumnsError, isGestorsError].some((item) => item)

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <ListComponent
                data={{ columnListData, tableData, gestorsData }}
                pagination={pagination}
                handleFilterChange={handleFilterChange}
                resetUserSelectedColumns={resetColumns}
                storeUserSelectedColumns={saveColumnSelection}
                sort={filterParams?.sort ?? []}
                isLoading={isLoading}
                isError={isError}
            />
        </QueryFeedback>
    )
}
