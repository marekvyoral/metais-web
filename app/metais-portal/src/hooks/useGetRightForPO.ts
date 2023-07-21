import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { getRightsForPO } from '@/api/getRightsForPO'
import { Role } from '@/contexts/auth/authContext'

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
