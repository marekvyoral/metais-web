import { useMutation } from '@tanstack/react-query'

import { revokeUser } from '@isdd/metais-common/api/RevokeUser'

export const useRevokeUserBatch = () => {
    const mutation = useMutation({
        mutationFn: async (data: { login: string; token: string | null }[]) => {
            return Promise.all(data.map(({ login, token }) => revokeUser(login, token)))
        },
    })

    return {
        mutate: mutation.mutate,
        isLoading: mutation.isLoading,
        isError: mutation.isError,
    }
}
