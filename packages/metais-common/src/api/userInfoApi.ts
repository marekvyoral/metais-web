import { User } from '@isdd/metais-common/contexts/auth/authContext'

export const getUserInfo = async (token: string): Promise<{ data: User; statusCode: number }> => {
    const url = `${import.meta.env.VITE_REST_CLIENT_BASE_URL}/metaisiam/userinfo`
    const resp = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
    const data: User = await resp.json()
    return {
        data,
        statusCode: resp.status,
    }
}
