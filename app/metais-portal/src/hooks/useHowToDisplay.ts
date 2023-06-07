import { UseQueryResult, useQueries } from '@tanstack/react-query'

import { getHowToDisplayConstraints } from '@/api/HowToDisplay'

export interface IEnumItem {
    id: number
    code: string
    value: string
    valid: boolean
    description: string
    orderList: number | null
    engValue: string
    engDescription: string
}

export interface IEnumData {
    id: number
    code: string
    name: string
    description: string
    valid: boolean
    category: null
    enumItems: IEnumItem[]
}

export const useHowToDisplayConstraints = (constraintsList: (string | undefined)[]) => {
    const resultList: UseQueryResult<IEnumData, unknown>[] = useQueries({
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

import { useQuery } from '@tanstack/react-query'

import { getHowToDisplayUnits } from '@/api/HowToDisplay'

export const useHowToDisplayUnits = (enabled: boolean) => {
    const units: UseQueryResult<IEnumData, unknown> = useQuery({
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
