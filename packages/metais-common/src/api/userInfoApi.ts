import { User } from '../contexts/auth/authContext'

export const getUserInfo = async (token: string): Promise<{ data: User; statusCode: number }> => {
    const url = `/metaisiam/userinfo`
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
