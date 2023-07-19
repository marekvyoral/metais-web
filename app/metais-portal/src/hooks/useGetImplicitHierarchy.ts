import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { GetImplicitHierarchyFilter } from '@/components/containers/CiCreateEntityContainer'
import { HierarchyRightsResultUi, useReadCiListUsingPOST1 } from '@/api'

export const useGetImplicitHierarchy = (filter: GetImplicitHierarchyFilter) => {
    const implicitHierarchy = useReadCiListUsingPOST1()

    const query: UseQueryResult<HierarchyRightsResultUi, unknown> = useQuery({
        queryKey: ['implicitHierarchy', filter.page, filter.perpage, filter.rights],
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
