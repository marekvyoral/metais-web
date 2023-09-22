import { useGetRoleParticipantBulk, useReadCiList1 } from '@isdd/metais-common/api'
import { useFilterForCiList, useGetColumnData, usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { mapFilterParamsToApi } from '@isdd/metais-common/componentHelpers/filter'
import { BASE_PAGE_SIZE } from '@isdd/metais-common/constants'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
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
    const { currentPreferences } = useUserPreferences()

    const metaAttributes = currentPreferences.showInvalidatedItems ? { state: ['DRAFT', 'INVALIDATED'] } : { state: ['DRAFT'] }

    const defaultRequestApi = {
        filter: {
            type: [entityName],
            metaAttributes,
            perPage: BASE_PAGE_SIZE,
        },
    }

    const { filterToNeighborsApi, filterParams, handleFilterChange } = useFilterForCiList(defaultFilterValues, entityName, defaultRequestApi)

    const {
        data: tableData,
        isLoading: isReadCiListLoading,
        isError: isReadCiListError,
        refetch,
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
        <ListComponent
            data={{ columnListData, tableData, gestorsData }}
            pagination={pagination}
            handleFilterChange={handleFilterChange}
            resetUserSelectedColumns={resetColumns}
            storeUserSelectedColumns={saveColumnSelection}
            refetch={refetch}
            sort={filterParams?.sort ?? []}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
