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

    return async ({ url, method, params: searchParams, data, headers, responseType }) => {
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

        const fileContentTypes = [
            'blob',
            'application/xml',
            'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/pdf',
        ]

        let responseBody
        let responseBodyText = ''
        const contentType = responseType ?? response.headers.get('Content-Type') ?? ''

        if (fileContentTypes?.includes(contentType)) {
            responseBody = await response.blob()
        } else if (contentType.includes('application/json')) {
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
        } else {
            responseBodyText = await response.text()
            responseBody = responseBodyText
        }

        if (response.status === 401) {
            logOut()
            login()
        }
        if (!response.ok) {
            throw new Error(responseBodyText)
        }

        if (callback) callback(responseBody)
        if (responseBody) return responseBody
        return response.status
    }
}
