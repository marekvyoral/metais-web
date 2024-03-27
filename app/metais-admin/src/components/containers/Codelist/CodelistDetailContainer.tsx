import { IFilter } from '@isdd/idsk-ui-kit/types'
import {
    EnumItem,
    EnumType,
    useDeleteEnumItem,
    useGetEnum,
    useInsertEnumItem,
    useUpdateEnumItem,
    useValidEnumItem,
} from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { latiniseString } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, UseMutationResult } from '@tanstack/react-query'
import React, { useCallback, useMemo } from 'react'

export enum CodelistDetailFilterInputs {
    CODE = 'CODE',
    VALUE = 'VALUE',
    ENG_VALUE = 'ENG_VALUE',
    ENG_DESCRIPTION = 'ENG_DESCRIPTION',
    DESCRIPTION = 'DESCRIPTION',
}

export enum FilterPropertiesEnum {
    FULLTEXT_SEARCH = 'fullTextSearch',
}

export interface CodelistDetailFilterData extends IFilterParams, IFilter {
    code?: string
    value?: string
    description?: string
    engValue?: string
    engDescription?: string
}

export interface CodeListDetailMutations {
    updateEnumItem: UseMutationResult<
        void,
        unknown,
        {
            data: EnumType
        },
        unknown
    >
    deleteEnumItem: UseMutationResult<
        void,
        unknown,
        {
            code: string
        },
        unknown
    >
    createEnumItem: UseMutationResult<
        void,
        unknown,
        {
            codeEnumType: string
            data: EnumType
        },
        unknown
    >
    validateEnumItem: UseMutationResult<
        void,
        unknown,
        {
            code: string
        },
        unknown
    >
}

export interface ICodelistPagination {
    currentPage: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

export interface ICodelistDetailContainerView {
    filteredData: EnumType
    mutations: CodeListDetailMutations
    isLoading: boolean
    isError: boolean
    refetch: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<EnumType, unknown>>
}

interface ICodelistDetailContainer {
    defaults: { [key: string]: string }
    View: React.FC<ICodelistDetailContainerView>
    enumCode: string
}

export const CodelistDetailContainer: React.FC<ICodelistDetailContainer> = ({ View, defaults, enumCode }) => {
    const { data: codelistDetailData, refetch, isLoading, isError } = useGetEnum(enumCode)

    const { filter } = useFilterParams(defaults)

    const filterFunction = useCallback(
        (item: EnumItem) => {
            const itemCode = latiniseString(item.code || '')
            const itemDescription = latiniseString(item.description || '')
            const itemEngDescription = latiniseString(item.engDescription || '')
            const itemEngValue = latiniseString(item.engValue || '')
            const itemValue = latiniseString(item.value || '')

            const filterCode = latiniseString(filter[CodelistDetailFilterInputs.CODE] || '')
            const filterValue = latiniseString(filter[CodelistDetailFilterInputs.VALUE] || '')
            const filterEngValue = latiniseString(filter[CodelistDetailFilterInputs.ENG_VALUE] || '')
            const filterDescription = latiniseString(filter[CodelistDetailFilterInputs.DESCRIPTION] || '')
            const filterEngDescription = latiniseString(filter[CodelistDetailFilterInputs.ENG_DESCRIPTION] || '')
            const filterSearch = latiniseString(filter[FilterPropertiesEnum.FULLTEXT_SEARCH] || '')

            let matchCode = true,
                matchValue = true,
                matchEngValue = true,
                matchDescription = true,
                matchEngDescription = true,
                matchSearch = true

            if (filterCode) matchCode = itemCode.includes(filterCode)
            if (filterValue) matchValue = itemValue.includes(filterValue)
            if (filterEngValue) matchEngValue = itemEngValue.includes(filterEngValue)
            if (filterDescription) matchDescription = itemDescription.includes(filterDescription)
            if (filterEngDescription) matchEngDescription = itemEngDescription.includes(filterEngDescription)
            if (filterSearch) {
                matchSearch =
                    itemCode.includes(filterSearch) ||
                    itemValue.includes(filterSearch) ||
                    itemEngValue.includes(filterSearch) ||
                    itemDescription.includes(filterSearch) ||
                    itemEngDescription.includes(filterSearch)
            }

            return matchCode && matchValue && matchEngValue && matchDescription && matchEngDescription && matchSearch
        },
        [filter],
    )

    const filteredData = useMemo(() => codelistDetailData?.enumItems?.filter(filterFunction), [codelistDetailData?.enumItems, filterFunction])

    const updateEnumItem = useUpdateEnumItem({
        mutation: {
            onSuccess() {
                refetch()
            },
        },
    })

    const createEnumItem = useInsertEnumItem({
        mutation: {
            onSuccess() {
                refetch()
            },
        },
    })

    const deleteEnumItem = useDeleteEnumItem({
        mutation: {
            onSuccess() {
                refetch()
            },
        },
    })

    const validateEnumItem = useValidEnumItem({
        mutation: {
            onSuccess() {
                refetch()
            },
        },
    })

    return (
        <View
            filteredData={{ enumItems: filteredData }}
            mutations={{ updateEnumItem, deleteEnumItem, createEnumItem, validateEnumItem }}
            isLoading={isLoading}
            isError={isError}
            refetch={refetch}
        />
    )
}
