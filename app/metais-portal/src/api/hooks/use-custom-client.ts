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
    return async ({ url, method, params, data }) => {
        const response = await fetch(`https://corsproxy.io/?${baseURL}${url}` + new URLSearchParams(params), {
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

export default useCustomClient
