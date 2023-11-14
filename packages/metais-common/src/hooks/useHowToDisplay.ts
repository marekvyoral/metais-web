import { UseQueryResult, useQueries } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { getHowToDisplayConstraints } from '@isdd/metais-common/api/HowToDisplay'

export const useHowToDisplayConstraints = (constraintsList: (string | undefined)[]) => {
    const { i18n } = useTranslation()

    const resultList: UseQueryResult<EnumType, unknown>[] = useQueries({
        queries: constraintsList.map((value: string | undefined) => {
            return {
                queryKey: ['displayConstraints', i18n.language, value],
                queryFn: () => getHowToDisplayConstraints(value, i18n.language),
                enabled: !!value,
            }
        }),
    })

    useEffect(() => {
        resultList.forEach((item) => item.refetch)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language])

    const isLoading = resultList.some((item) => item.isLoading)
    const isError = resultList.some((item) => item.isError)

    return {
        isLoading,
        isError,
        resultList,
    }
}
