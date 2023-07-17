import {
    useForm,
    FieldValues,
    Control,
    FormState,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormReset,
    UseFormResetField,
    DeepPartial,
    UseFormSetValue,
} from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { BaseSyntheticEvent, useState } from 'react'
import { IFilter } from '@isdd/idsk-ui-kit/types'

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

interface ReturnUseFilterParamas<T> {
    filter: T
    urlParams: URLSearchParams
    handleFilterChange: (changedFilter: IFilter) => void
}

export function useFilterParams<T extends FieldValues & IFilterParams>(defaults: T & IFilter): ReturnUseFilterParamas<T> {
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
        ...defaults,
        fullTextSearch: '',
    }

    Object.keys(filter).forEach((key) => {
        if (urlParams.get(key)) {
            // eslint-disable-next-line
            // @ts-ignore
            filter[key] = urlParams.get(key)
        }
    })
    filter.attributeFilters = parseCustomAttributes(urlParams)

    return { filter, urlParams, handleFilterChange }
}

export function useFilter<T extends FieldValues & IFilterParams>(defaults: T): ReturnUseFilter<T> {
    const { filter } = useFilterParams<T>(defaults)
    const methods = useForm<T & IFilterParams>({ defaultValues: filter as DeepPartial<T> })
    const [, setSearchParams] = useSearchParams()

    function clearData(obj: T): T {
        return Object.fromEntries<T>(Object.entries<T>(obj).filter(([key, v]) => !!v && key !== 'attributeFilters')) as T
    }

    const onSubmit = methods.handleSubmit((data: T) => {
        setSearchParams(clearData(data))
    })

    return {
        ...methods,
        filter,
        shouldBeFilterOpen: Object.keys(filter).some((key) => key !== 'fullTextSearch'),
        resetFilters: () => {
            methods.reset()
            setSearchParams({})
        },
        onSubmit,
    }
}
