import { useQuery, useQueryClient } from '@tanstack/react-query'

import { ClaimListFilterContainerUi, useReadList } from '@isdd/metais-common/api/generated/claim-manager-swagger'

interface GetRequestListProps {
    uuids: string[]
    filter: ClaimListFilterContainerUi
}

const QUERY_KEY = 'requestList'

export const useGetRequestList = ({ uuids, filter }: GetRequestListProps) => {
    const readList = useReadList()

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: [QUERY_KEY, uuids, filter],
        queryFn: async () => {
            return (await readList.mutateAsync({ data: filter })) ?? []
        },
        enabled: uuids && !!uuids.length,
    })

    return {
        isLoading,
        data,
        isError,
        isFetching,
    }
}

export const useInvalidateRequestsListCache = () => {
    const queryClient = useQueryClient()
    const invalidate = () => {
        queryClient.invalidateQueries([QUERY_KEY])
    }
    return { invalidate }
}
