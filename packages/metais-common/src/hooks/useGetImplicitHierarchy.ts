import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { HierarchyRightsResultUi, useReadCiList } from '@isdd/metais-common/api'

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

export const useGetImplicitHierarchy = (filter: GetImplicitHierarchyFilter) => {
    const implicitHierarchy = useReadCiList()

    const query: UseQueryResult<HierarchyRightsResultUi, unknown> = useQuery({
        queryKey: ['implicitHierarchy', filter.page, filter.perpage, filter.rights, filter.fullTextSearch],
        queryFn: () => implicitHierarchy.mutateAsync({ data: filter }),
        keepPreviousData: true,
    })
    const { data: implicitHierarchyData, isLoading, isError } = query

    return {
        implicitHierarchyData,
        isLoading,
        isError,
    }
}
