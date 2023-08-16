import {
    Control,
    DeepPartial,
    FieldValues,
    FormState,
    useForm,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormReset,
    UseFormResetField,
    UseFormSetValue,
} from 'react-hook-form'
import { useLocation, useSearchParams } from 'react-router-dom'
import { BaseSyntheticEvent, useCallback, useEffect, useState } from 'react'
import { IFilter } from '@isdd/idsk-ui-kit/types'

import { FilterActions, useFilterContext } from '@isdd/metais-common/contexts/filter/filterContext'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/constants'

export enum OPERATOR_OPTIONS {
    FULLTEXT = 'FULLTEXT',
    EQUAL = 'EQUAL',
    GREATER = 'GREATER',
    LOWER = 'LOWER',
    EQUAL_OR_GREATER = 'EQUAL_OR_GREATER',
    EQUAL_OR_LOWER = 'EQUAL_OR_LOWER',
}

interface IAttributeFilterValue {
    value: string
    operator: OPERATOR_OPTIONS
}

export interface IAttributeFilters {
    [key: string]: IAttributeFilterValue[]
}

export interface IFilterParams {
    fullTextSearch?: string
    [key: `${string}--${string}`]: string | undefined
    attributeFilters?: IAttributeFilters
}

// extended type from react-hook-form
interface ReturnUseFilter<TFieldValues extends FieldValues> {
    formState: FormState<TFieldValues>
    resetField: UseFormResetField<TFieldValues>
    reset: UseFormReset<TFieldValues>
    handleSubmit: UseFormHandleSubmit<TFieldValues>
    setValue: UseFormSetValue<TFieldValues>
    onSubmit: (e?: BaseSyntheticEvent) => void
    filter: TFieldValues
    resetFilters: () => void
    shouldBeFilterOpen: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<TFieldValues, any>
    register: UseFormRegister<TFieldValues>
}

const parseCustomAttributes = (urlParams: URLSearchParams): undefined | IAttributeFilters => {
    let attributeFilters: undefined | IAttributeFilters = undefined
    for (const queryKey of urlParams.keys()) {
        if (queryKey.includes('--')) {
            const value = urlParams.get(queryKey)
            if (value) {
                const [name, operator] = queryKey.split('--')
                if (!name || !operator || !value) continue
                if (!attributeFilters) attributeFilters = {}
                if (attributeFilters && !attributeFilters[name]) {
                    attributeFilters = {
                        ...attributeFilters,
                        [name]: [],
                    }
                }
                if (Object.values(OPERATOR_OPTIONS).includes(operator as OPERATOR_OPTIONS)) {
                    attributeFilters[name].push({ operator: operator as OPERATOR_OPTIONS, value })
                }
            }
        }
    }
    return attributeFilters
}

interface ReturnUseFilterParams<T> {
    filter: T
    urlParams: URLSearchParams
    handleFilterChange: (changedFilter: IFilter) => void
}

const getPropertyType = <T, K extends keyof T>(obj: T, key: K): string => {
    return typeof obj[key]
}

export function useFilterParams<T extends FieldValues & IFilterParams>(defaults: T & IFilter): ReturnUseFilterParams<T> {
    const [urlParams] = useSearchParams()
    const [uiFilterState, setUiFilterState] = useState<IFilter>({
        sort: defaults?.sort ?? [],
        pageNumber: defaults?.pageNumber ?? BASE_PAGE_NUMBER,
        pageSize: defaults?.pageSize ?? BASE_PAGE_SIZE,
    })
    const handleFilterChange = (changedFilter: IFilter) => {
        setUiFilterState({
            ...uiFilterState,
            ...changedFilter,
        })
    }

    const filter: T & IFilterParams & IFilter = {
        ...uiFilterState,
        fullTextSearch: '',
    } as T & IFilterParams & IFilter

    Object.keys(filter)
        .concat(Object.keys(defaults))
        .forEach((key) => {
            if (urlParams.get(key)) {
                const propertyType = getPropertyType(defaults, key)
                if (propertyType === 'object') {
                    const value = urlParams.getAll(key)
                    // eslint-disable-next-line
                    // @ts-ignore
                    filter[key] = value
                } else {
                    // eslint-disable-next-line
                    // @ts-ignore
                    filter[key] = urlParams.get(key)
                }
            }
        })
    filter.attributeFilters = parseCustomAttributes(urlParams)

    return { filter, urlParams, handleFilterChange }
}

export function useFilter<T extends FieldValues & IFilterParams>(defaults: T): ReturnUseFilter<T> {
    const [, setSearchParams] = useSearchParams()
    const location = useLocation()
    const { state, dispatch } = useFilterContext()
    const { filter } = useFilterParams<T>(defaults)

    const methods = useForm<T & IFilterParams>({ defaultValues: filter as DeepPartial<T> })

    const clearData = useCallback((obj: T): T => {
        return Object.fromEntries<T>(Object.entries<T>(obj).filter(([key, v]) => !!v && key !== 'attributeFilters')) as T
    }, [])

    const onSubmit = methods.handleSubmit((data: T) => {
        const filterData = clearData(data)
        setSearchParams(filterData)
        dispatch({
            type: FilterActions.SET_FILTER,
            value: filterData,
            path: location.pathname,
        })
    })

    const handleShouldBeFilterOpen = () => {
        if (defaults != null) {
            const defaultKeys = Object.keys(defaults)
            const hasDefaultValue = defaultKeys.some((item) => defaults[item])

            if (filter.fullTextSearch || hasDefaultValue) {
                return true
            }
        }

        return false
    }

    useEffect(() => {
        if (!state.filter[location.pathname] && !state.clearedFilter[location.pathname]) {
            dispatch({
                type: FilterActions.SET_FILTER,
                value: defaults,
                path: location.pathname,
            })
            setSearchParams(clearData(defaults))
        }
    }, [defaults, dispatch, location.pathname, setSearchParams, state.clearedFilter, state.filter, clearData])

    return {
        ...methods,
        filter,
        shouldBeFilterOpen: handleShouldBeFilterOpen(),
        resetFilters: () => {
            methods.reset()
            setSearchParams({})
            dispatch({ type: FilterActions.RESET_FILTER, path: location.pathname })
        },
        onSubmit,
    }
}
