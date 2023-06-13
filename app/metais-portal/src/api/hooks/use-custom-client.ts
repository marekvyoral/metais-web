export type BodyType<BodyData> = BodyData & { headers?: object }

export type ErrorType<ErrorData> = ErrorData

type CustomClient<T> = (data: {
    url: string
    method: 'get' | 'post' | 'put' | 'delete' | 'patch'
    params?: Record<string, string>
    headers?: Record<string, string>
    data?: BodyType<unknown>
    signal?: AbortSignal
}) => Promise<T>

export const useCustomClient = <T>(baseURL: string): CustomClient<T> => {
    //vite proxy not working?
    const proxyUrl = 'https://corsproxy.io/?'

    return async ({ url, method, params, data }) => {
        const searchParams = params ? `?${new URLSearchParams(params)}` : ''
        const response = await fetch(`${proxyUrl}${baseURL}${url}` + searchParams, {
            headers: {
                method,
                ...data?.headers,
                // accessToken: `Bearer ${accessToken}`,
            },
            ...(data ? { body: JSON.stringify(data) } : {}),
        })

        return response.json()
    }
}
