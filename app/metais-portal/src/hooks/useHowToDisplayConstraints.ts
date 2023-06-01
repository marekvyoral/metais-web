import { useQueries } from '@tanstack/react-query'

import { getHowToDisplayConstraints } from '@/api/HowToDisplay'

export const useHowToDisplayConstraints = (constraintsList: string[]) => {
    const resultList = useQueries({
        queries: constraintsList.map((value: string) => {
            return {
                queryKey: ['displayConstraints', value],
                queryFn: () => getHowToDisplayConstraints(value),
                enabled: !!value,
            }
        }),
    })

    const isLoading = resultList.some((item) => item.isLoading)
    const isError = resultList.some((item) => item.isError)

    return {
        isLoading,
        isError,
        resultList,
    }
}
