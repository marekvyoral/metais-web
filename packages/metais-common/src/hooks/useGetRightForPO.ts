import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { getRightsForPO } from '@isdd/metais-common/api/getRightsForPO'
import { Role } from '@isdd/metais-common/contexts/auth/authContext'

export const useGetRightForPO = (userId: string, orgId: string, token: string) => {
    const query: UseQueryResult<Role[], unknown> = useQuery({
        queryKey: ['getRightsForPO', userId, orgId],
        queryFn: () => getRightsForPO(userId, orgId, token),
        enabled: !!orgId,
    })

    const { data: rightsForPOData, isLoading, isError } = query

    return {
        rightsForPOData,
        isLoading,
        isError,
    }
}
