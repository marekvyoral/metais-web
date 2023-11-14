import { useMutation } from '@tanstack/react-query'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

const deleteCacheCmdb = async (accessToken: string) => {
    const cmdbUrl = import.meta.env.VITE_REST_CLIENT_CMDB_TARGET_URL
    const url = `${cmdbUrl}/cache`
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    })

    if (!response.ok) {
        throw new Error()
    }

    return response.text()
}

export const useDeleteCacheForCi = (entityName?: string, onSuccess?: () => void) => {
    const {
        state: { token },
    } = useAuth()

    return useMutation({
        mutationFn: () => deleteCacheCmdb(token ?? ''),
        mutationKey: ['deleteCacheForCi', entityName],
        onSuccess: () => {
            if (onSuccess) {
                onSuccess()
            }
        },
    })
}
