import { UseQueryResult, useQueries } from '@tanstack/react-query'

import { EnumType, useGetValidEnumHook } from '@isdd/metais-common/api/generated/enums-repo-swagger'

export const useGetEnumBulk = (enumCodeList: (string | undefined)[]) => {
    const getEnum = useGetValidEnumHook()

    const resultList: UseQueryResult<EnumType, unknown>[] = useQueries({
        queries: enumCodeList.map((code: string | undefined) => {
            return {
                queryKey: ['reportEnums', code],
                queryFn: () => getEnum(code ?? ''),
                enabled: !!code,
            }
        }),
    })

    const isLoading = resultList.some((item) => item.isLoading)
    const isError = resultList.some((item) => item.isError)
    const data = resultList?.map((result) => result?.data)
    return {
        isLoading,
        isError,
        data,
    }
}
