import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce'

import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export type BodyType<BodyData> = BodyData & { headers?: object }

export type ErrorType<ErrorData> = ErrorData

export type CustomClient<T> = (data: {
    url: string
    method: 'get' | 'post' | 'put' | 'delete' | 'patch'
    params?: Record<string, string>
    headers?: Record<string, string>
    data?: BodyType<unknown>
    signal?: AbortSignal
    responseType?: 'blob' | 'text'
}) => Promise<T>

export const useCustomClient = <T>(baseURL: string, callback?: (responseBody: T) => void): CustomClient<T> => {
    const {
        state: { token },
    } = useAuth()
    const { logOut, login } = useContext<IAuthContext>(AuthContext)
    const { i18n } = useTranslation()

    return async ({ url, method, params: searchParams, data, headers, responseType = 'text' }) => {
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
        if (token) {
            customHeaders['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${baseURL}${url}${params}`, {
            method,
            headers: customHeaders,
            ...(data ? { body: JSON.stringify(data) } : {}),
        })

        let responseBody
        let responseBodyText = ''
        switch (responseType) {
            case 'blob':
                responseBody = await response.blob()
                break
            default: {
                responseBodyText = await response.text()
                if (responseBodyText?.length > 0) {
                    try {
                        responseBody = JSON.parse(responseBodyText)
                    } catch (e) {
                        // eslint-disable-next-line no-console
                        console.error('Response not json')
                        responseBody = responseBodyText
                    }
                }
            }
        }

        const contentType = response.headers.get('Content-Type')

        if (response.status === 401) {
            logOut()
            login()
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
