import { useQuery } from '@tanstack/react-query'

import { getEntityCiAttributesToDisplay } from '@/api/EntityCiApi'

export const useEntityCiAttributes = (entityId: string) => {
    const { isLoading, isError, data } = useQuery({
        queryKey: ['entityCiAttributesData', entityId],
        queryFn: () => getEntityCiAttributesToDisplay(entityId),
    })

    return {
        isLoading,
        isError,
        data,
    }
}
