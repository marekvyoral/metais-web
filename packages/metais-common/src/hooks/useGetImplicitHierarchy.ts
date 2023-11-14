import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { HierarchyPOFilterUi, HierarchyRightsResultUi, useReadCiList } from '@isdd/metais-common/api/generated/cmdb-swagger'

export interface GetImplicitHierarchyFilter {
    fullTextSearch: string
    page: number
    perpage: number
    sortBy: string
    sortType: string
    rights: {
        poUUID: string
        roles: string[]
    }[]
}

export const useGetImplicitHierarchy = (filter: HierarchyPOFilterUi, enabled: boolean) => {
    const implicitHierarchy = useReadCiList()

    const query: UseQueryResult<HierarchyRightsResultUi, unknown> = useQuery({
        queryKey: ['implicitHierarchy', filter.page, filter.perpage, filter.rights, filter.fullTextSearch],
        queryFn: () => implicitHierarchy.mutateAsync({ data: filter }),
        keepPreviousData: true,
        enabled: enabled,
    })
    const { data: implicitHierarchyData, isLoading: isQueryLoading, isError, fetchStatus } = query

    const isLoading = isQueryLoading && fetchStatus != 'idle'

    return {
        implicitHierarchyData,
        isLoading,
        isError,
    }
}
