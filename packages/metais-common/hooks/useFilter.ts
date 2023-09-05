import { yupResolver } from '@hookform/resolvers/yup'
import { IFilter } from '@isdd/idsk-ui-kit/types'
import { BaseSyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react'
import {
    Control,
    DeepPartial,
    FieldValues,
    FormState,
    useForm,
    UseFormClearErrors,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormReset,
    UseFormResetField,
    UseFormSetValue,
    UseFormWatch,
} from 'react-hook-form'
import { useLocation, useSearchParams } from 'react-router-dom'
import { ObjectSchema } from 'yup'

import { convertFilterArrayData } from '@isdd/metais-common/componentHelpers/filter/convertFilterArrayData'
import { convertUrlArrayAttribute } from '@isdd/metais-common/componentHelpers/filter/convertUrlArrayValue'
import { transformOperatorsToUrl } from '@isdd/metais-common/componentHelpers/filter/transformOperators'
import { updateUrlParamsOnChange } from '@isdd/metais-common/componentHelpers/filter/updateUrlParamsOnChange'
import {
    BASE_PAGE_NUMBER,
    BASE_PAGE_SIZE,
    filterKeysToSkip,
    JOIN_OPERATOR,
    OPERATOR_SEPARATOR,
    OPERATOR_SEPARATOR_TYPE,
} from '@isdd/metais-common/constants'
import { FilterActions, useFilterContext } from '@isdd/metais-common/contexts/filter/filterContext'

//types for API
export enum OPERATOR_OPTIONS {
    FULLTEXT = 'FULLTEXT',
    EQUAL = 'EQUAL',
    GREATER = 'GREATER',
    LOWER = 'LOWER',
    EQUAL_OR_GREATER = 'EQUAL_OR_GREATER',
    EQUAL_OR_LOWER = 'EQUAL_OR_LOWER',
}

//types written in URL
export enum OPERATOR_OPTIONS_URL {
    FULLTEXT = 'ilike',
    EQUAL = 'eq',
    GREATER = 'gt',
    LOWER = 'lt',
    EQUAL_OR_GREATER = 'gte',
    EQUAL_OR_LOWER = 'lte',
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
    [key: `${string}${OPERATOR_SEPARATOR_TYPE}${string}`]: string | undefined | string[] | Date | null
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
    watch: UseFormWatch<TFieldValues>
    clearErrors: UseFormClearErrors<TFieldValues>
}

const parseCustomAttributes = (urlParams: URLSearchParams): undefined | IAttributeFilters => {
    let attributeFilters: undefined | IAttributeFilters = undefined
    for (const queryKey of urlParams.keys()) {
        if (queryKey.includes(OPERATOR_SEPARATOR)) {
            const value = urlParams.get(queryKey)
            if (value) {
                const [name, operator] = queryKey.split(OPERATOR_SEPARATOR)
                if (!name || !operator || !value) continue
                if (!attributeFilters) attributeFilters = {}
                if (attributeFilters && !attributeFilters[name]) {
                    attributeFilters = {
                        ...attributeFilters,
                        [name]: [],
                    }
                }

                if (Object.values(OPERATOR_OPTIONS_URL).includes(operator as OPERATOR_OPTIONS_URL)) {
                    if (value.includes(JOIN_OPERATOR)) {
                        const convertedArrayAttribute = convertUrlArrayAttribute(transformOperatorsToUrl(operator) as OPERATOR_OPTIONS, value)
                        attributeFilters[name] = convertedArrayAttribute.filter((attribute) => Boolean(attribute))
                    } else {
                        attributeFilters[name].push({
                            operator: transformOperatorsToUrl(operator) as OPERATOR_OPTIONS,
                            value: value,
                        })
                    }
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
    const [urlParams, setUrlParams] = useSearchParams()
    const location = useLocation()
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
        updateUrlParamsOnChange(changedFilter, setUrlParams)
    }

    const filter: T & IFilterParams & IFilter = useMemo(() => {
        const memoFilter = {
            ...uiFilterState,
            fullTextSearch: '',
        } as T & IFilterParams & IFilter

        Object.keys(memoFilter)
            .concat(Object.keys(defaults))
            .forEach((key) => {
                if (urlParams.get(key)) {
                    const propertyType = getPropertyType(defaults, key)
                    if (propertyType === 'object') {
                        const value = urlParams.getAll(key)
                        if (key === 'sort') {
                            // eslint-disable-next-line
                            // @ts-ignore
                            memoFilter[key] = JSON.parse(value)
                        }
                        // eslint-disable-next-line
                        // @ts-ignore
                        else memoFilter[key] = value
                    } else {
                        // eslint-disable-next-line
                        // @ts-ignore
                        memoFilter[key] = urlParams.get(key)
                    }
                } else {
                    if (!location.search) {
                        // eslint-disable-next-line
                        // @ts-ignore
                        memoFilter[key] = defaults[key]
                    }
                }
            })

        memoFilter.attributeFilters = parseCustomAttributes(urlParams)
        return memoFilter
    }, [uiFilterState, defaults, urlParams, location.search])

    return { filter, urlParams, handleFilterChange }
}

export function useFilter<T extends FieldValues & IFilterParams>(defaults: T, schema?: ObjectSchema<T>): ReturnUseFilter<T> {
    const [, setSearchParams] = useSearchParams()
    const location = useLocation()
    const { state, dispatch } = useFilterContext()
    const { filter } = useFilterParams<T>(defaults)

    const methods = useForm<T & IFilterParams>({ defaultValues: filter as DeepPartial<T>, resolver: schema ? yupResolver(schema) : undefined })
    const { reset, handleSubmit, formState } = methods
    useEffect(() => {
        if (state.clearedFilter[location.pathname]) {
            reset(filter as DeepPartial<T>)
        }
    }, [filter, location.pathname, reset, formState.errors, state.clearedFilter])

    const clearData = useCallback((obj: T): T => {
        return Object.fromEntries<T>(Object.entries<T>(obj).filter(([key, v]) => !!v && key !== 'attributeFilters')) as T
    }, [])

    const onSubmit = handleSubmit((data: T) => {
        const filterData = clearData(data)
        const convertedArrayFilterData = convertFilterArrayData(filterData)
        //so when user is on page 200 and filter spits out only 2 pages he can get to them
        setSearchParams({ ...convertedArrayFilterData, pageNumber: 1 })
        dispatch({
            type: FilterActions.SET_FILTER,
            value: convertedArrayFilterData,
            path: location.pathname,
        })
    })

    const handleShouldBeFilterOpen = () => {
        if (filter != null) {
            const defaultKeys = Object.keys(filter)
            const hasCurrentValue = defaultKeys.some((item) => {
                if (filterKeysToSkip.has(item)) return false
                return filter[item]
            })

            const hasAttribute = filter.attributeFilters
            if (hasCurrentValue || hasAttribute) {
                return true
            }
        }

        return false
    }

    useEffect(() => {
        if (!state.filter[location.pathname] && !state.clearedFilter[location.pathname]) {
            //&& !filter) { TODO: WHAT ABOUT THIS
            dispatch({
                type: FilterActions.SET_FILTER,
                value: defaults,
                path: location.pathname,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        ...methods,
        filter,
        shouldBeFilterOpen: handleShouldBeFilterOpen(),
        resetFilters: () => {
            reset()
            setSearchParams({})
            dispatch({ type: FilterActions.RESET_FILTER, path: location.pathname })
        },
        onSubmit,
    }
}
