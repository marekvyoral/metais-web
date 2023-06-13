import { useQuery } from '@tanstack/react-query'

import { CiListFilterContainerUi } from '../api/generated/cmdb-swagger'

import { postTableData } from '@/api/TableApi'

export const useCiQuery = (entityName: string, filter: CiListFilterContainerUi) => {
    const ciQuery = useQuery({
        queryKey: ['tableData', entityName, filter.page, filter.perpage],
        queryFn: () => postTableData(filter),
        keepPreviousData: true,
    })

    const { isLoading, isError, data } = ciQuery

    return {
        isLoading,
        isError,
        data,
    }
}
