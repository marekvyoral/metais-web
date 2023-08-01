import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { AuthActions, useAuth } from '@isdd/metais-common/contexts/auth/authContext'

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
    const { i18n } = useTranslation()

    return async ({ url, method, params: searchParams, data }) => {
        const allParams = {
            ...searchParams,
            lang: i18n.language,
        }
        const params = `?${new URLSearchParams(allParams)}`
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept-Language': i18n.language,
            ...data?.headers,
        }
        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`
        }
        const response = await fetch(`${baseURL}${url}${params}`, {
            method,
            headers,
            ...(data ? { body: JSON.stringify(data) } : {}),
        })

        const responseBodyText = await response.text()

        const responseBody = responseBodyText.length > 0 && JSON.parse(responseBodyText)

        if (response.status == 401) {
            dispatch({ type: AuthActions.LOGOUT })
            navigate('/?token_expired=true')
        }
        if (!response.ok) {
            throw new Error('InternalServerError')
        }
        if (callback) callback(responseBody)

        return responseBody
    }
}
