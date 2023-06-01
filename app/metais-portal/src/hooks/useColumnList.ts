import { useQuery } from '@tanstack/react-query'

import { getColumnList } from '@/api/TableApi'

export const useColumnList = (entityName: string) => {
    const { isLoading, isError, data } = useQuery({
        queryKey: ['columnsList', entityName],
        queryFn: () => getColumnList(entityName),
    })

    return {
        isLoading,
        isError,
        data,
    }
}
