import { UseQueryResult, useQueries } from '@tanstack/react-query'

import { getHowToDisplayConstraints } from '@/api/HowToDisplay'
import { EnumType, useGetEnumUsingGET } from '@/api'

export const useHowToDisplayConstraints = (constraintsList: (string | undefined)[]) => {
    const resultList: UseQueryResult<EnumType, unknown>[] = useQueries({
        queries: constraintsList.map((value: string | undefined) => {
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

export const useHowToDisplayUnits = () => {
    const units = useGetEnumUsingGET('MERNA_JEDNOTKA')

    const { isLoading, isError, data } = units

    return {
        isLoading,
        isError,
        data,
    }
}
