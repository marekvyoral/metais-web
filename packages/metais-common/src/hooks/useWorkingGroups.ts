import { UseQueryResult, useQueries } from '@tanstack/react-query'

import { Group, useFindByUuid3Hook } from '@isdd/metais-common/api/generated/iam-swagger'

interface IUseWorkingGroups {
    workingGroupIds: string[]
}

export const useWorkingGroups = ({ workingGroupIds }: IUseWorkingGroups) => {
    const readWorkingGroup = useFindByUuid3Hook()

    const resultList: UseQueryResult<Group>[] = useQueries({
        queries: workingGroupIds?.map((workingGroupId) => {
            return {
                queryKey: ['workingGroup', workingGroupId],
                queryFn: () => readWorkingGroup(workingGroupId),
                enabled: true,
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
