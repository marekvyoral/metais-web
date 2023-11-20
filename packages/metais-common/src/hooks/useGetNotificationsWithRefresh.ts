import { useQuery } from '@tanstack/react-query'
import { IFilter } from '@isdd/idsk-ui-kit/src/types'

import { useGetNotificationListElasticHook } from '@isdd/metais-common/src/api/generated/notifications-swagger'

interface useGetNotificationsWithRefreshProps {
    filter: IFilter
    enabled: boolean
}

export const useGetNotificationsWithRefresh = ({ filter, enabled }: useGetNotificationsWithRefreshProps) => {
    const getNotificationsMutation = useGetNotificationListElasticHook()
    const fetchProps = {
        perPage: filter.pageSize ?? 10,
        pageNumber: filter.pageNumber ?? 1,
        onlyUnread: filter.onlyUnread ?? false,
    }
    const { data } = useQuery({
        queryKey: [],
        queryFn: async () => {
            return await getNotificationsMutation(fetchProps)
        },
        enabled,
        refetchInterval: 30000,
    })

    return {
        data,
    }
}
