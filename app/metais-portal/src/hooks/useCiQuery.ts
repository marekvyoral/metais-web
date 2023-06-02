import { useQuery } from '@tanstack/react-query'

import { IListQueryArgs, postTableData } from '@/api/TableApi'

export const useCiQuery = (params: IListQueryArgs) => {
    const { isLoading, isError, data } = useQuery({
        queryKey: ['tableData', params],
        queryFn: () => postTableData(params),
    })

    return {
        isLoading,
        isError,
        data,
    }
}
