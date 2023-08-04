import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { Role } from '@isdd/metais-common/contexts/auth/authContext'
import { useGetRightsForPO as getRightsFromGenerated } from '@isdd/metais-common/api/generated/iam-swagger'

export const useGetRightForPO = (userId: string, orgId: string) => {
    const mutation = getRightsFromGenerated()
    const query: UseQueryResult<Role[], unknown> = useQuery({
        queryKey: ['getRightsForPO', userId, orgId],
        queryFn: () =>
            mutation.mutateAsync({
                data: {
                    identityUuid: userId,
                    cmdbId: orgId,
                },
            }),
        enabled: !!orgId,
    })

    const { data: rightsForPOData, isLoading, isError } = query

    return {
        rightsForPOData,
        isLoading,
        isError,
    }
}
