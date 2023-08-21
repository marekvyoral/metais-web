export const revokeUser = async (login: string, token: string | null) => {
    const query = new URLSearchParams({ login })
    const baseUrl = import.meta.env.VITE_REST_CLIENT_METAIS_IAM_REST_TARGET_URL

    return fetch(baseUrl + `/metaisiam/revoke_user?${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}
