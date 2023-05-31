import { useQueries, useQuery } from '@tanstack/react-query'

import { getEntityRelationTypeData, getEntityRelationsTypeCount } from '@/api/EntityRelationsApi'

export const useEntityRelationsTypesCount = (id: string) => {
    const { isLoading, isError, data } = useQuery({
        queryKey: ['entityRelationsTypeCount', id],
        queryFn: () => getEntityRelationsTypeCount(id),
    })

    const keysToDisplay = (data && Object.keys(data).filter((item) => data[item] > 0)) ?? []

    return {
        isLoading,
        isError,
        data,
        keysToDisplay,
    }
}

export const useEntityRelationsDataList = (keyList: string[], id: string, start: boolean) => {
    const resultList = useQueries({
        queries: keyList.map((value: string) => {
            return {
                queryKey: ['entityRelationsData', id, value],
                queryFn: () => getEntityRelationTypeData(id, value),
                enabled: !!value && start,
            }
        }),
    })

    const isLoading = resultList.map((item) => item.isLoading).some((item) => item)
    const isError = resultList.map((item) => item.isError).some((item) => item)

    return {
        isLoading,
        isError,
        resultList,
    }
}
