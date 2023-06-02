import { useQuery } from '@tanstack/react-query'

import { ITableDataParams, postTableData } from '@/api/TableApi'

export const useTableData = (params: ITableDataParams) => {
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
