import { useQuery } from '@tanstack/react-query'

import { useIsInPoByGid1 } from '@isdd/metais-common/api/generated/iam-swagger'

export const isInPoByGidsMutationKey = 'isInPoByGids'

interface useGetRoleIdsForRoleProps {
    identityGids: string[]
    gids: string[]
    enabled?: boolean
}

export const useGetRoleIdsForRole = ({ identityGids, gids, enabled = true }: useGetRoleIdsForRoleProps) => {
    const isInPoByGidsMutation = useIsInPoByGid1()

    const { data } = useQuery({
        queryKey: [isInPoByGidsMutationKey, identityGids, gids],
        queryFn: async () => {
            return await isInPoByGidsMutation.mutateAsync({
                data: {
                    identityGids,
                    gids,
                },
            })
        },
        enabled,
    })

    return {
        data,
    }
}
