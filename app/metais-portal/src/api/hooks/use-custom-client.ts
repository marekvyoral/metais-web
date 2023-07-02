import { useNavigate } from 'react-router-dom'

import { AuthActions, useAuth } from '@/contexts/auth/authContext'

export type BodyType<BodyData> = BodyData & { headers?: object }

export type ErrorType<ErrorData> = ErrorData

export type CustomClient<T> = (data: {
    url: string
    method: 'get' | 'post' | 'put' | 'delete' | 'patch'
    params?: Record<string, string>
    headers?: Record<string, string>
    data?: BodyType<unknown>
    signal?: AbortSignal
}) => Promise<T>

export const useCustomClient = <T>(baseURL: string, callback?: (responseBody: T) => void): CustomClient<T> => {
    const {
        state: { accessToken },
        dispatch,
    } = useAuth()

    const navigate = useNavigate()
    return async ({ url, method, params, data }) => {
        const searchParams = params ? `?${new URLSearchParams(params)}` : ''
        const response = await fetch(`${baseURL}${url}` + searchParams, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...data?.headers,
                Authorization: `Bearer ${accessToken}`,
            },
            ...(data ? { body: JSON.stringify(data) } : {}),
        })

        const responseBody = await response.json()
        if (response.status == 401) {
            dispatch({ type: AuthActions.LOGOUT })
            navigate('/?token_expired=true')
        }
        if (callback) callback(responseBody)
        return responseBody
    }
}
