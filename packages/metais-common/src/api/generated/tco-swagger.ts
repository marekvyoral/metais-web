//@ts-nocheck
/**
 * Generated by orval v6.16.0 🍺
 * Do not edit manually.
 * MetaIS TCO
 * OpenAPI spec version: 3.0-SNAPSHOT
 */
import { useQuery, useMutation } from '@tanstack/react-query'
import type { UseQueryOptions, UseMutationOptions, QueryFunction, MutationFunction, UseQueryResult, QueryKey } from '@tanstack/react-query'
import { useTcoSwaggerClient } from '../hooks/useTcoSwaggerClient'
export type GetEkoCodesParams = {
    sortBy?: string
    ascending?: boolean
    isActive?: boolean
}

export interface ExpensePhaseList {
    expensePhases?: ExpensePhase[]
}

export interface ExpenseYearList {
    yearsList?: string[]
}

export interface RisPreviewAnnualBudget {
    year?: number
    accepted?: number
    corrected?: number
    real?: number
}

export interface RisPreviewSummaryPerYear {
    summaryBudget?: RisPreviewAnnualBudget
}

export interface RisPreviewBudgetsForEco {
    ekoCode?: string
    ekoCodeName?: string
    description?: string
    annualBudgets?: RisPreviewAnnualBudget[]
}

export interface RisPreviewBudgetsForEcoList {
    count?: number
    ecoBudgetsList?: RisPreviewBudgetsForEco[]
    summaryPerYearList?: RisPreviewSummaryPerYear[]
}

export interface DmsInfo {
    dmsId?: string
}

export interface ExpensePhase {
    id?: number
    name?: string
    description?: string
}

export interface ExpensesSet {
    years?: string[]
    dmsId?: string
    modifiedBy?: string
    modifiedAt?: string
    expensePhase?: ExpensePhase
    fileDmsRef?: string
    expensesType: string
    expenseItems: ExpensesSetExpenseItemsItem[]
}

export interface ExpensesSetList {
    expensesSetList?: ExpensesSet[]
}

export type ExpenseItemSwAllOf = {
    ekoCode?: string
}

export type ExpenseItemSw = ExpenseItem & ExpenseItemSwAllOf

export type ExpensesSetExpenseItemsItem = ExpenseItemHw | ExpenseItemOwnership | ExpenseItemSw

export type ExpenseItemOwnershipAllOf = {
    item?: string
}

export type ExpenseItemHwAllOf = {
    ekoCode?: string
}

export interface ExpenseItem {
    type?: string
    year?: number
    value?: number
}

export type ExpenseItemOwnership = ExpenseItem & ExpenseItemOwnershipAllOf

export type ExpenseItemHw = ExpenseItem & ExpenseItemHwAllOf

export interface RisExpenseItem {
    id?: number
    element?: string
    administrator?: string
    operator?: string
    ekoCode?: string
    acceptedBudget?: number
    correctedBudget?: number
    realBudget?: number
}

export interface RisAnnualExpense {
    id?: number
    year?: number
    month?: number
    sentAt?: string
    risExpenseItems?: RisExpenseItem[]
}

export interface MetaData {
    createdBy?: string
    createdAt?: string
    lastModifiedBy?: string
    lastModifiedAt?: string
}

export type EkoCodeEkoCodeState = (typeof EkoCodeEkoCodeState)[keyof typeof EkoCodeEkoCodeState]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EkoCodeEkoCodeState = {
    ACTIVE: 'ACTIVE',
    INVALIDATED: 'INVALIDATED',
} as const

export interface EkoCode {
    name?: string
    description?: string
    ekoCode?: string
    ekoCodeState?: EkoCodeEkoCodeState
    metaData?: MetaData
    isUsed?: boolean
}

export interface EkoCodeList {
    ekoCodes?: EkoCode[]
    ekoCodesCount?: number
}

export interface TcoRok {
    name?: string
    value?: number
}

export interface TcoNaklady {
    id?: string
    name?: string
    code?: string
    sprava?: string
    prevadzka?: string
    spolu?: number
    rokList?: TcoRok[]
    minYear?: string
    maxYear?: string
}

export interface TcoNakladyList {
    nakladyList?: TcoNaklady[]
    rokySpolu?: TcoRok[]
    size?: number
}

export interface PhaseDate {
    phaseId?: number
    phaseDate?: string
}

export interface IsvsExpenses {
    isvsId?: string
    isvsName?: string
    isvsCode?: string
    phaseDates?: PhaseDate[]
}

export interface IsvsExpensesList {
    isvsList?: IsvsExpenses[]
    count?: number
}

type AwaitedInput<T> = PromiseLike<T> | T

type Awaited<O> = O extends AwaitedInput<infer T> ? T : never

export const useUpdateEkoCodeHook = () => {
    const updateEkoCode = useTcoSwaggerClient<void>()

    return (ekoCodeId: string, ekoCode: EkoCode) => {
        return updateEkoCode({ url: `/ekocodes/${ekoCodeId}`, method: 'put', headers: { 'Content-Type': 'application/json' }, data: ekoCode })
    }
}

export const useUpdateEkoCodeMutationOptions = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<ReturnType<typeof useUpdateEkoCodeHook>>>,
        TError,
        { ekoCodeId: string; data: EkoCode },
        TContext
    >
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useUpdateEkoCodeHook>>>, TError, { ekoCodeId: string; data: EkoCode }, TContext> => {
    const { mutation: mutationOptions } = options ?? {}

    const updateEkoCode = useUpdateEkoCodeHook()

    const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useUpdateEkoCodeHook>>>, { ekoCodeId: string; data: EkoCode }> = (
        props,
    ) => {
        const { ekoCodeId, data } = props ?? {}

        return updateEkoCode(ekoCodeId, data)
    }

    return { mutationFn, ...mutationOptions }
}

export type UpdateEkoCodeMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useUpdateEkoCodeHook>>>>
export type UpdateEkoCodeMutationBody = EkoCode
export type UpdateEkoCodeMutationError = unknown

export const useUpdateEkoCode = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<
        Awaited<ReturnType<ReturnType<typeof useUpdateEkoCodeHook>>>,
        TError,
        { ekoCodeId: string; data: EkoCode },
        TContext
    >
}) => {
    const mutationOptions = useUpdateEkoCodeMutationOptions(options)

    return useMutation(mutationOptions)
}

export const useDeleteEkoCodeHook = () => {
    const deleteEkoCode = useTcoSwaggerClient<void>()

    return (ekoCodeId: string) => {
        return deleteEkoCode({ url: `/ekocodes/${ekoCodeId}`, method: 'delete' })
    }
}

export const useDeleteEkoCodeMutationOptions = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useDeleteEkoCodeHook>>>, TError, { ekoCodeId: string }, TContext>
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useDeleteEkoCodeHook>>>, TError, { ekoCodeId: string }, TContext> => {
    const { mutation: mutationOptions } = options ?? {}

    const deleteEkoCode = useDeleteEkoCodeHook()

    const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useDeleteEkoCodeHook>>>, { ekoCodeId: string }> = (props) => {
        const { ekoCodeId } = props ?? {}

        return deleteEkoCode(ekoCodeId)
    }

    return { mutationFn, ...mutationOptions }
}

export type DeleteEkoCodeMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useDeleteEkoCodeHook>>>>

export type DeleteEkoCodeMutationError = unknown

export const useDeleteEkoCode = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useDeleteEkoCodeHook>>>, TError, { ekoCodeId: string }, TContext>
}) => {
    const mutationOptions = useDeleteEkoCodeMutationOptions(options)

    return useMutation(mutationOptions)
}

export const useUpdateHrEkoCodeHook = () => {
    const updateHrEkoCode = useTcoSwaggerClient<void>()

    return (ekoCodeList: EkoCodeList) => {
        return updateHrEkoCode({ url: `/ekocodes/invalidate`, method: 'put', headers: { 'Content-Type': 'application/json' }, data: ekoCodeList })
    }
}

export const useUpdateHrEkoCodeMutationOptions = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useUpdateHrEkoCodeHook>>>, TError, { data: EkoCodeList }, TContext>
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useUpdateHrEkoCodeHook>>>, TError, { data: EkoCodeList }, TContext> => {
    const { mutation: mutationOptions } = options ?? {}

    const updateHrEkoCode = useUpdateHrEkoCodeHook()

    const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useUpdateHrEkoCodeHook>>>, { data: EkoCodeList }> = (props) => {
        const { data } = props ?? {}

        return updateHrEkoCode(data)
    }

    return { mutationFn, ...mutationOptions }
}

export type UpdateHrEkoCodeMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useUpdateHrEkoCodeHook>>>>
export type UpdateHrEkoCodeMutationBody = EkoCodeList
export type UpdateHrEkoCodeMutationError = unknown

export const useUpdateHrEkoCode = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useUpdateHrEkoCodeHook>>>, TError, { data: EkoCodeList }, TContext>
}) => {
    const mutationOptions = useUpdateHrEkoCodeMutationOptions(options)

    return useMutation(mutationOptions)
}

export const useEditEkoCodeHook = () => {
    const editEkoCode = useTcoSwaggerClient<void>()

    return (ekoCodeId: string, ekoCode: EkoCode) => {
        return editEkoCode({ url: `/ekocodes/edit/${ekoCodeId}`, method: 'put', headers: { 'Content-Type': 'application/json' }, data: ekoCode })
    }
}

export const useEditEkoCodeMutationOptions = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEditEkoCodeHook>>>, TError, { ekoCodeId: string; data: EkoCode }, TContext>
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEditEkoCodeHook>>>, TError, { ekoCodeId: string; data: EkoCode }, TContext> => {
    const { mutation: mutationOptions } = options ?? {}

    const editEkoCode = useEditEkoCodeHook()

    const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useEditEkoCodeHook>>>, { ekoCodeId: string; data: EkoCode }> = (
        props,
    ) => {
        const { ekoCodeId, data } = props ?? {}

        return editEkoCode(ekoCodeId, data)
    }

    return { mutationFn, ...mutationOptions }
}

export type EditEkoCodeMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useEditEkoCodeHook>>>>
export type EditEkoCodeMutationBody = EkoCode
export type EditEkoCodeMutationError = unknown

export const useEditEkoCode = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEditEkoCodeHook>>>, TError, { ekoCodeId: string; data: EkoCode }, TContext>
}) => {
    const mutationOptions = useEditEkoCodeMutationOptions(options)

    return useMutation(mutationOptions)
}

export const useGetEkoCodesHook = () => {
    const getEkoCodes = useTcoSwaggerClient<EkoCodeList>()

    return (params?: GetEkoCodesParams, signal?: AbortSignal) => {
        return getEkoCodes({ url: `/ekocodes`, method: 'get', params, signal })
    }
}

export const getGetEkoCodesQueryKey = (params?: GetEkoCodesParams) => [`/ekocodes`, ...(params ? [params] : [])] as const

export const useGetEkoCodesQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useGetEkoCodesHook>>>, TError = unknown>(
    params?: GetEkoCodesParams,
    options?: { query?: UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEkoCodesHook>>>, TError, TData> },
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEkoCodesHook>>>, TError, TData> & { queryKey: QueryKey } => {
    const { query: queryOptions } = options ?? {}

    const queryKey = queryOptions?.queryKey ?? getGetEkoCodesQueryKey(params)

    const getEkoCodes = useGetEkoCodesHook()

    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useGetEkoCodesHook>>>> = ({ signal }) => getEkoCodes(params, signal)

    return { queryKey, queryFn, ...queryOptions }
}

export type GetEkoCodesQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useGetEkoCodesHook>>>>
export type GetEkoCodesQueryError = unknown

export const useGetEkoCodes = <TData = Awaited<ReturnType<ReturnType<typeof useGetEkoCodesHook>>>, TError = unknown>(
    params?: GetEkoCodesParams,
    options?: { query?: UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useGetEkoCodesHook>>>, TError, TData> },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
    const queryOptions = useGetEkoCodesQueryOptions(params, options)

    const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey }

    query.queryKey = queryOptions.queryKey

    return query
}

export const useCreateEkoCodeHook = () => {
    const createEkoCode = useTcoSwaggerClient<void>()

    return (ekoCode: EkoCode) => {
        return createEkoCode({ url: `/ekocodes`, method: 'post', headers: { 'Content-Type': 'application/json' }, data: ekoCode })
    }
}

export const useCreateEkoCodeMutationOptions = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useCreateEkoCodeHook>>>, TError, { data: EkoCode }, TContext>
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useCreateEkoCodeHook>>>, TError, { data: EkoCode }, TContext> => {
    const { mutation: mutationOptions } = options ?? {}

    const createEkoCode = useCreateEkoCodeHook()

    const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useCreateEkoCodeHook>>>, { data: EkoCode }> = (props) => {
        const { data } = props ?? {}

        return createEkoCode(data)
    }

    return { mutationFn, ...mutationOptions }
}

export type CreateEkoCodeMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useCreateEkoCodeHook>>>>
export type CreateEkoCodeMutationBody = EkoCode
export type CreateEkoCodeMutationError = unknown

export const useCreateEkoCode = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useCreateEkoCodeHook>>>, TError, { data: EkoCode }, TContext>
}) => {
    const mutationOptions = useCreateEkoCodeMutationOptions(options)

    return useMutation(mutationOptions)
}

export const useDeleteHrEkoCodeHook = () => {
    const deleteHrEkoCode = useTcoSwaggerClient<void>()

    return (ekoCodeList: EkoCodeList) => {
        return deleteHrEkoCode({ url: `/ekocodes/delete`, method: 'delete', headers: { 'Content-Type': 'application/json' }, data: ekoCodeList })
    }
}

export const useDeleteHrEkoCodeMutationOptions = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useDeleteHrEkoCodeHook>>>, TError, { data: EkoCodeList }, TContext>
}): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useDeleteHrEkoCodeHook>>>, TError, { data: EkoCodeList }, TContext> => {
    const { mutation: mutationOptions } = options ?? {}

    const deleteHrEkoCode = useDeleteHrEkoCodeHook()

    const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useDeleteHrEkoCodeHook>>>, { data: EkoCodeList }> = (props) => {
        const { data } = props ?? {}

        return deleteHrEkoCode(data)
    }

    return { mutationFn, ...mutationOptions }
}

export type DeleteHrEkoCodeMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useDeleteHrEkoCodeHook>>>>
export type DeleteHrEkoCodeMutationBody = EkoCodeList
export type DeleteHrEkoCodeMutationError = unknown

export const useDeleteHrEkoCode = <TError = unknown, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useDeleteHrEkoCodeHook>>>, TError, { data: EkoCodeList }, TContext>
}) => {
    const mutationOptions = useDeleteHrEkoCodeMutationOptions(options)

    return useMutation(mutationOptions)
}
