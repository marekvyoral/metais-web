import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { GetImplicitHierarchyFilter } from '@/components/containers/CiCreateEntityContainer'
import { ReadCiList200, useReadCiList } from '@/api'

export const useGetImplicitHierarchy = (filter: GetImplicitHierarchyFilter) => {
    const implicitHierarchy = useReadCiList()

    const query: UseQueryResult<ReadCiList200, unknown> = useQuery({
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