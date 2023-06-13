import { UseQueryResult, useQueries, useQuery } from '@tanstack/react-query'

import { getHowToDisplayConstraints, getHowToDisplayUnits } from '@/api/HowToDisplay'
import { EnumType } from '@/api/generated/enums-repo-swagger'

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

export const useHowToDisplayUnits = (enabled: boolean) => {
    const units: UseQueryResult<EnumType, unknown> = useQuery({
        queryKey: ['displayUnits'],
        queryFn: () => getHowToDisplayUnits(),
        enabled: enabled,
    })

    const { isLoading, isError, data } = units

    return {
        isLoading,
        isError,
        data,
    }
}
