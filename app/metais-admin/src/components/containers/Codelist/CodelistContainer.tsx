import { ColumnSort, IFilter } from '@isdd/idsk-ui-kit/types'
import {
    EnumType,
    EnumTypePreview,
    EnumTypePreviewList,
    useDeleteEnumType,
    useInsertEnumType,
    useListValidEnums,
    useUpdateEnumType,
    useValidEnumType,
} from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { latiniseString } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { UseMutationResult, useQueryClient } from '@tanstack/react-query'
import React, { SetStateAction, useState } from 'react'

export enum CodelistFilterInputs {
    NAME = 'NAME',
    VALUE = 'VALUE',
    VALUE_DESCRIPTION = 'VALUE_DESCRIPTION',
}

export enum FilterPropertiesEnum {
    FULLTEXT_SEARCH = 'fullTextSearch',
}

export interface CodeListsMutations {
    updateEnum: UseMutationResult<
        void,
        unknown,
        {
            data: EnumType
        },
        unknown
    >
    deleteEnum: UseMutationResult<
        void,
        unknown,
        {
            code: string
        },
        unknown
    >
    createEnum: UseMutationResult<
        void,
        unknown,
        {
            data: EnumType
        },
        unknown
    >
    validateEnum: UseMutationResult<
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
export interface CodelistFilter extends IFilterParams, IFilter {
    [CodelistFilterInputs.NAME]: string
    [CodelistFilterInputs.VALUE]: string
    [CodelistFilterInputs.VALUE_DESCRIPTION]: string
}
export interface ICodelistContainerView {
    filteredData: EnumTypePreviewList
    mutations: CodeListsMutations
    isLoading: boolean
    isError: boolean
    sort: ColumnSort[]
    setSort: React.Dispatch<SetStateAction<ColumnSort[]>>
    handleFilterChange: (changedFilter: IFilter) => void
    filter: CodelistFilter
}

interface ICodelistContainer {
    defaults: CodelistFilter
    View: React.FC<ICodelistContainerView>
}

export const CodelistContainer: React.FC<ICodelistContainer> = ({ View, defaults }) => {
    const {
        data: codelistData,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useListValidEnums({
        query: {
            queryKey: ['codelists'],
        },
    })

    const queryClient = useQueryClient()

    const { filter, handleFilterChange } = useFilterParams(defaults)
    const [sort, setSort] = useState<ColumnSort[]>([])

    const filterFunction = (item: EnumTypePreview) => {
        const itemCode = latiniseString(item.code || '')
        const itemName = latiniseString(item.name || '')
        const itemDescription = latiniseString(item.description || '')

        const filterValue = latiniseString(filter[CodelistFilterInputs.VALUE] || '')
        const filterName = latiniseString(filter[CodelistFilterInputs.NAME] || '')
        const filterDescription = latiniseString(filter[CodelistFilterInputs.VALUE_DESCRIPTION] || '')
        const filterSearch = latiniseString(filter[FilterPropertiesEnum.FULLTEXT_SEARCH] || '')

        let matchValue = true,
            matchName = true,
            matchDescription = true,
            matchSearch = true

        if (filterValue) matchValue = itemCode.includes(filterValue)
        if (filterName) matchName = itemName.includes(filterName)
        if (filterDescription) matchDescription = itemDescription.includes(filterDescription)
        if (filterSearch) {
            matchSearch = itemCode.includes(filterSearch) || itemName.includes(filterSearch) || itemDescription.includes(filterSearch)
        }

        return matchValue && matchName && matchDescription && matchSearch
    }

    const filteredData = codelistData?.results?.filter(filterFunction)

    const updateEnum = useUpdateEnumType({
        mutation: {
            onSuccess() {
                refetch()
            },
        },
    })

    const createEnum = useInsertEnumType({
        mutation: {
            onSuccess() {
                refetch()
            },
        },
    })

    const deleteEnum = useDeleteEnumType({
        mutation: {
            onSuccess(variables, context) {
                queryClient.setQueryData(['codelists'], (oldData: EnumTypePreviewList | undefined) => {
                    if (oldData == null || oldData.results == null) return oldData

                    const itemToUpdateIndex = oldData.results.findIndex((item) => item.code === context.code)
                    return {
                        results: [
                            ...oldData.results.slice(0, itemToUpdateIndex),
                            { ...oldData.results[itemToUpdateIndex], valid: false },
                            ...oldData.results.slice(itemToUpdateIndex + 1),
                        ],
                    }
                })
            },
        },
    })

    const validateEnum = useValidEnumType({
        mutation: {
            onSuccess(variables, context) {
                queryClient.setQueryData(['codelists'], (oldData: EnumTypePreviewList | undefined) => {
                    if (oldData == null || oldData.results == null) return oldData

                    const itemToUpdateIndex = oldData.results.findIndex((item) => item.code === context.code)
                    return {
                        results: [
                            ...oldData.results.slice(0, itemToUpdateIndex),
                            { ...oldData.results[itemToUpdateIndex], valid: true },
                            ...oldData.results.slice(itemToUpdateIndex + 1),
                        ],
                    }
                })
            },
        },
    })

    return (
        <View
            filteredData={{ results: filteredData }}
            mutations={{ updateEnum, deleteEnum, createEnum, validateEnum }}
            isLoading={isLoading || isFetching}
            isError={isError}
            setSort={setSort}
            sort={sort}
            handleFilterChange={handleFilterChange}
            filter={filter}
        />
    )
}
