import { useQuery } from '@tanstack/react-query'

import { fetchCanCreateGraph } from '@isdd/metais-common/api/fetchCanCreateGraph'
import { CAN_CREATE_GRAPH_QUERY_KEY } from '@isdd/metais-common/constants'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export const useCanCreateGraph = () => {
    const {
        state: { user, token },
    } = useAuth()

    const isLoggedIn = !!user?.uuid

    const { data, isLoading, isError, fetchStatus } = useQuery({
        enabled: isLoggedIn,
        queryKey: [CAN_CREATE_GRAPH_QUERY_KEY, user?.uuid],
        queryFn: () => fetchCanCreateGraph(token ?? ''),
    })
    return {
        data,
        isLoading: isLoading && fetchStatus != 'idle',
        isError,
    }
}
