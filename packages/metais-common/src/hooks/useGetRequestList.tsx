import { useQuery } from '@tanstack/react-query'

import { ClaimListFilterContainerUi, useReadList } from '@isdd/metais-common/api/generated/claim-manager-swagger'

interface GetRequestListProps {
    uuids: string[]
    filter: ClaimListFilterContainerUi
}

export const useGetRequestList = ({ uuids, filter }: GetRequestListProps) => {
    const readList = useReadList()

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ['requestList', uuids, filter],
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
