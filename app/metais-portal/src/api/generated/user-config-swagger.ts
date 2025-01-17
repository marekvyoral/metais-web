//@ts-nocheck
/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * MetaIS User Config
 * Api Documentation
 * OpenAPI spec version: 3.0-SNAPSHOT
 */
import { useQuery, useMutation } from '@tanstack/react-query'
import type { UseQueryOptions, UseMutationOptions, QueryFunction, MutationFunction, UseQueryResult, QueryKey } from '@tanstack/react-query'
import { useUserConfigSwaggerClient } from '../hooks/useUserConfigSwaggerClient'
/**
 * favoriteCiType
 */
export type FavoriteCiTypeBody = FavoriteCiType

export interface FavoriteColumn {
    name?: string
    order?: number
}

export interface FavoriteCiType {
    attributes?: FavoriteColumn[]
    ciType?: string
    id?: number
    metaAttributes?: FavoriteColumn[]
}

type AwaitedInput<T> = PromiseLike<T> | T

type Awaited<O> = O extends AwaitedInput<infer T> ? T : never

/**
 * @summary getUserColumns
 */
export const useGetUserColumnsUsingGETHook = () => {
    const getUserColumnsUsingGET = useUserConfigSwaggerClient<FavoriteCiType>()

    return (citype: string, signal?: AbortSignal) => {
        return getUserColumnsUsingGET({ url: `/columns/citype/${citype}`, method: 'get', signal })
    }
}

export const getGetUserColumnsUsingGETQueryKey = (citype: string) => [`/columns/citype/${citype}`] as const

export const useGetUserColumnsUsingGETQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useGetUserColumnsUsingGETHook>>>, TError = void>(
    citype: string,
    options?: { query?: UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetUserColumnsUsingGETHook>>>, TError, TData> },
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetUserColumnsUsingGETHook>>>, TError, TData> & { queryKey: QueryKey } => {
    const { query: queryOptions } = options ?? {}

    const queryKey = queryOptions?.queryKey ?? getGetUserColumnsUsingGETQueryKey(citype)

    const getUserColumnsUsingGET = useGetUserColumnsUsingGETHook()

    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useGetUserColumnsUsingGETHook>>>> = ({ signal }) =>
        getUserColumnsUsingGET(citype, signal)

    return { queryKey, queryFn, enabled: !!citype, ...queryOptions }
}

export type GetUserColumnsUsingGETQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useGetUserColumnsUsingGETHook>>>>
export type GetUserColumnsUsingGETQueryError = void

/**
 * @summary getUserColumns
 */
export const useGetUserColumnsUsingGET = <TData = Awaited<ReturnType<ReturnType<typeof useGetUserColumnsUsingGETHook>>>, TError = void>(
    citype: string,
    options?: { query?: UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetUserColumnsUsingGETHook>>>, TError, TData> },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
    const queryOptions = useGetUserColumnsUsingGETQueryOptions(citype, options)

    const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey }

    query.queryKey = queryOptions.queryKey

    return query
}

/**
 * @summary resetUserColumns
 */
export const useResetUserColumnsUsingDELETEHook = () => {
    const resetUserColumnsUsingDELETE = useUserConfigSwaggerClient<void>()

    return (citype: string) => {
        return resetUserColumnsUsingDELETE({ url: `/columns/citype/${citype}`, method: 'delete' })
    }
}

export const useResetUserColumnsUsingDELETEMutationOptions = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useResetUserColumnsUsingDELETEHook>>>, TError, { citype: string }, TContext>
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useResetUserColumnsUsingDELETEHook>>>, TError, { citype: string }, TContext> => {
    const { mutation: mutationOptions } = options ?? {}

    const resetUserColumnsUsingDELETE = useResetUserColumnsUsingDELETEHook()

    const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useResetUserColumnsUsingDELETEHook>>>, { citype: string }> = (props) => {
        const { citype } = props ?? {}

        return resetUserColumnsUsingDELETE(citype)
    }

    return { mutationFn, ...mutationOptions }
}

export type ResetUserColumnsUsingDELETEMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useResetUserColumnsUsingDELETEHook>>>>

export type ResetUserColumnsUsingDELETEMutationError = unknown

/**
 * @summary resetUserColumns
 */
export const useResetUserColumnsUsingDELETE = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useResetUserColumnsUsingDELETEHook>>>, TError, { citype: string }, TContext>
}) => {
    const mutationOptions = useResetUserColumnsUsingDELETEMutationOptions(options)

    return useMutation(mutationOptions)
}

/**
 * @summary getDefaultColumns
 */
export const useGetDefaultColumnsUsingGETHook = () => {
    const getDefaultColumnsUsingGET = useUserConfigSwaggerClient<FavoriteCiType>()

    return (citype: string, signal?: AbortSignal) => {
        return getDefaultColumnsUsingGET({ url: `/columns/citype/${citype}/default`, method: 'get', signal })
    }
}

export const getGetDefaultColumnsUsingGETQueryKey = (citype: string) => [`/columns/citype/${citype}/default`] as const

export const useGetDefaultColumnsUsingGETQueryOptions = <
    TData = Awaited<ReturnType<ReturnType<typeof useGetDefaultColumnsUsingGETHook>>>,
    TError = void,
>(
    citype: string,
    options?: { query?: UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetDefaultColumnsUsingGETHook>>>, TError, TData> },
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetDefaultColumnsUsingGETHook>>>, TError, TData> & { queryKey: QueryKey } => {
    const { query: queryOptions } = options ?? {}

    const queryKey = queryOptions?.queryKey ?? getGetDefaultColumnsUsingGETQueryKey(citype)

    const getDefaultColumnsUsingGET = useGetDefaultColumnsUsingGETHook()

    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useGetDefaultColumnsUsingGETHook>>>> = ({ signal }) =>
        getDefaultColumnsUsingGET(citype, signal)

    return { queryKey, queryFn, enabled: !!citype, ...queryOptions }
}

export type GetDefaultColumnsUsingGETQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useGetDefaultColumnsUsingGETHook>>>>
export type GetDefaultColumnsUsingGETQueryError = void

/**
 * @summary getDefaultColumns
 */
export const useGetDefaultColumnsUsingGET = <TData = Awaited<ReturnType<ReturnType<typeof useGetDefaultColumnsUsingGETHook>>>, TError = void>(
    citype: string,
    options?: { query?: UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetDefaultColumnsUsingGETHook>>>, TError, TData> },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
    const queryOptions = useGetDefaultColumnsUsingGETQueryOptions(citype, options)

    const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey }

    query.queryKey = queryOptions.queryKey

    return query
}

/**
 * @summary insertUserColumns
 */
export const useInsertUserColumnsUsingPOSTHook = () => {
    const insertUserColumnsUsingPOST = useUserConfigSwaggerClient<void>()

    return (favoriteCiTypeBody: FavoriteCiTypeBody) => {
        return insertUserColumnsUsingPOST({
            url: `/columns/store`,
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: favoriteCiTypeBody,
        })
    }
}

export const useInsertUserColumnsUsingPOSTMutationOptions = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<ReturnType<typeof useInsertUserColumnsUsingPOSTHook>>>,
        TError,
        { data: FavoriteCiTypeBody },
        TContext
    >
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useInsertUserColumnsUsingPOSTHook>>>, TError, { data: FavoriteCiTypeBody }, TContext> => {
    const { mutation: mutationOptions } = options ?? {}

    const insertUserColumnsUsingPOST = useInsertUserColumnsUsingPOSTHook()

    const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useInsertUserColumnsUsingPOSTHook>>>, { data: FavoriteCiTypeBody }> = (
        props,
    ) => {
        const { data } = props ?? {}

        return insertUserColumnsUsingPOST(data)
    }

    return { mutationFn, ...mutationOptions }
}

export type InsertUserColumnsUsingPOSTMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useInsertUserColumnsUsingPOSTHook>>>>
export type InsertUserColumnsUsingPOSTMutationBody = FavoriteCiTypeBody
export type InsertUserColumnsUsingPOSTMutationError = unknown

/**
 * @summary insertUserColumns
 */
export const useInsertUserColumnsUsingPOST = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<ReturnType<typeof useInsertUserColumnsUsingPOSTHook>>>,
        TError,
        { data: FavoriteCiTypeBody },
        TContext
    >
}) => {
    const mutationOptions = useInsertUserColumnsUsingPOSTMutationOptions(options)

    return useMutation(mutationOptions)
}

/**
 * @summary insertDefaultColumns
 */
export const useInsertDefaultColumnsUsingPOSTHook = () => {
    const insertDefaultColumnsUsingPOST = useUserConfigSwaggerClient<void>()

    return (favoriteCiTypeBody: FavoriteCiTypeBody) => {
        return insertDefaultColumnsUsingPOST({
            url: `/columns/store/default`,
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            data: favoriteCiTypeBody,
        })
    }
}

export const useInsertDefaultColumnsUsingPOSTMutationOptions = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<ReturnType<typeof useInsertDefaultColumnsUsingPOSTHook>>>,
        TError,
        { data: FavoriteCiTypeBody },
        TContext
    >
}): UseMutationOptions<
    Awaited<ReturnType<ReturnType<typeof useInsertDefaultColumnsUsingPOSTHook>>>,
    TError,
    { data: FavoriteCiTypeBody },
    TContext
> => {
    const { mutation: mutationOptions } = options ?? {}

    const insertDefaultColumnsUsingPOST = useInsertDefaultColumnsUsingPOSTHook()

    const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useInsertDefaultColumnsUsingPOSTHook>>>, { data: FavoriteCiTypeBody }> = (
        props,
    ) => {
        const { data } = props ?? {}

        return insertDefaultColumnsUsingPOST(data)
    }

    return { mutationFn, ...mutationOptions }
}

export type InsertDefaultColumnsUsingPOSTMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useInsertDefaultColumnsUsingPOSTHook>>>>
export type InsertDefaultColumnsUsingPOSTMutationBody = FavoriteCiTypeBody
export type InsertDefaultColumnsUsingPOSTMutationError = unknown

/**
 * @summary insertDefaultColumns
 */
export const useInsertDefaultColumnsUsingPOST = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<ReturnType<typeof useInsertDefaultColumnsUsingPOSTHook>>>,
        TError,
        { data: FavoriteCiTypeBody },
        TContext
    >
}) => {
    const mutationOptions = useInsertDefaultColumnsUsingPOSTMutationOptions(options)

    return useMutation(mutationOptions)
}
