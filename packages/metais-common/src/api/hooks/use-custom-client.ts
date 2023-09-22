import { useLocation, useNavigate } from 'react-router-dom'
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
    const location = useLocation()
    const { i18n } = useTranslation()

    return async ({ url, method, params: searchParams, data, headers }) => {
        const allParams = {
            ...searchParams,
            lang: i18n.language,
        }
        const params = `?${new URLSearchParams(allParams)}`
        const customHeaders: Record<string, string> = {
            'Accept-Language': i18n.language,
            ...headers,
            ...data?.headers,
        }
        if (accessToken) {
            customHeaders['Authorization'] = `Bearer ${accessToken}`
        }
        const response = await fetch(`${baseURL}${url}${params}`, {
            method,
            headers: customHeaders,
            ...(data ? { body: JSON.stringify(data) } : {}),
        })

        const responseBodyText = await response.text()
        let responseBody
        if (responseBodyText?.length > 0) {
            try {
                responseBody = JSON.parse(responseBodyText)
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error('Response not json')
                responseBody = responseBodyText
            }
        }
        const contentType = response.headers.get('Content-Type')

        if (response.status === 401) {
            dispatch({ type: AuthActions.LOGOUT })
            navigate('/?token_expired=true', { state: { from: location } })
        }
        if (!response.ok) {
            throw new Error(responseBodyText)
        }

        if (contentType?.includes('application/json')) {
            try {
                const parsedResponseBody = JSON.parse(responseBody)
                if (callback) callback(parsedResponseBody)
                return parsedResponseBody
            } catch {
                if (callback) callback(responseBody)
                return responseBody
            }
        }

        return responseBody
    }
}
