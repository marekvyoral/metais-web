export const revokeUser = async (login: string, token: string | null) => {
    const query = new URLSearchParams({ login })
    const baseUrl = import.meta.env.VITE_REST_CLIENT_BASE_URL
    const iamName = import.meta.env.VITE_IAM_NAME

    return fetch(baseUrl + `/${iamName}/revoke_user?${query}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
}
