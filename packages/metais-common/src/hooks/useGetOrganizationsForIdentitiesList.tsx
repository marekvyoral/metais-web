import { useQuery } from '@tanstack/react-query'

import { useFindOrganizationsForList } from '@isdd/metais-common/api/generated/iam-swagger'

interface GetOrganizationsForIdentitiesListProps {
    uuids: string[]
}

export const useGetOrganizationsForIdentitiesList = ({ uuids }: GetOrganizationsForIdentitiesListProps) => {
    const organizationsForListMutation = useFindOrganizationsForList()

    const { data, isLoading, isError, isFetching } = useQuery({
        queryKey: ['organizationsForList', uuids],
        queryFn: async () => {
            return await organizationsForListMutation.mutateAsync({ data: uuids })
        },
        enabled: uuids && !!uuids.length,
    })

    return {
        data,
        isLoading,
        isError,
        isFetching,
    }
}
