import { FieldValues } from 'react-hook-form'

import { IFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { useGetRoleParticipantBulk, useReadCiList1 } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useFilterForCiList, useGetColumnData, usePagination } from '@isdd/metais-common/api/hooks/containers/containerHelpers'
import { mapFilterParamsToApi } from '@isdd/metais-common/componentHelpers'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'

interface Props<T extends FieldValues & IFilterParams> {
    entityName: string
    defaultFilterValues: T
    defaultFilterOperators?: T
    onlyValidItems?: boolean
}

export const useCiListContainer = <T extends FieldValues & IFilterParams>({
    entityName,
    defaultFilterValues,
    defaultFilterOperators,
    onlyValidItems,
}: Props<T>) => {
    const { columnListData, saveColumnSelection, resetColumns, isLoading: isColumnsLoading, isError: isColumnsError } = useGetColumnData(entityName)
    const { currentPreferences } = useUserPreferences()

    const defaultRequestApi = {
        filter: {
            type: [entityName],
        },
    }

    const { filterToNeighborsApi, filterParams, handleFilterChange } = useFilterForCiList(defaultFilterValues, defaultRequestApi)

    const liableEntity = currentPreferences.myPO ? [currentPreferences.myPO] : undefined

    const state = currentPreferences.showInvalidatedItems && !onlyValidItems ? ['DRAFT', 'INVALIDATED'] : ['DRAFT']

    const metaAttributes = { state, liableEntity, ...filterParams.metaAttributeFilters }

    const {
        data: tableData,
        isLoading: isReadCiListLoading,
        isError: isReadCiListError,
        isFetching: isReadCiListFetching,
        refetch,
    } = useReadCiList1({
        ...filterToNeighborsApi,
        filter: {
            ...filterToNeighborsApi.filter,
            fullTextSearch: filterParams.fullTextSearch || '',
            attributes: mapFilterParamsToApi(filterParams, defaultFilterOperators),
            metaAttributes,
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
    const isLoading = [isReadCiListLoading, isReadCiListFetching, isColumnsLoading, isGestorsLoadingCombined].some((item) => item)
    const isError = [isReadCiListError, isColumnsError, isGestorsError].some((item) => item)

    return {
        columnListData,
        tableData,
        gestorsData,
        pagination,
        storeUserSelectedColumns: saveColumnSelection,
        resetUserSelectedColumns: resetColumns,
        handleFilterChange,
        refetch,
        sort: filterParams?.sort ?? [],
        isLoading,
        isError,
    }
}
