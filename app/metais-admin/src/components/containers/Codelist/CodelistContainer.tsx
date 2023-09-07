import React from 'react'
import {
    EnumType,
    EnumTypePreviewList,
    useDeleteEnumType,
    useInsertEnumType,
    useListValidEnums,
    useUpdateEnumType,
    useValidEnumType,
} from '@isdd/metais-common/api'
import { UseMutationResult, useQueryClient } from '@tanstack/react-query'
import sift from 'sift'
import { useFilterParams } from '@isdd/metais-common/hooks/useFilter'

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

export interface ICodelistContainerView {
    filteredData: EnumTypePreviewList
    mutations: CodeListsMutations
    isLoading: boolean
    isError: boolean
}

interface ICodelistContainer {
    defaults: { [key: string]: string }
    View: React.FC<ICodelistContainerView>
}

export const CodelistContainer: React.FC<ICodelistContainer> = ({ View, defaults }) => {
    const {
        data: codelistData,
        isLoading,
        isError,
    } = useListValidEnums({
        query: {
            queryKey: ['codelists'],
        },
    })

    const queryClient = useQueryClient()

    const { filter } = useFilterParams(defaults)

    const testFilter = sift({
        code: function (value: string) {
            return (
                value
                    .toLocaleLowerCase()
                    .includes(filter[CodelistFilterInputs.VALUE] ? filter[CodelistFilterInputs.VALUE].toLocaleLowerCase() : '') &&
                value
                    .toLocaleLowerCase()
                    .includes(filter[FilterPropertiesEnum.FULLTEXT_SEARCH] ? filter[FilterPropertiesEnum.FULLTEXT_SEARCH].toLocaleLowerCase() : '')
            )
        },
        name: function (value: string) {
            return (
                value.toLocaleLowerCase().includes(filter[CodelistFilterInputs.NAME] ? filter[CodelistFilterInputs.NAME].toLocaleLowerCase() : '') &&
                value
                    .toLocaleLowerCase()
                    .includes(filter[FilterPropertiesEnum.FULLTEXT_SEARCH] ? filter[FilterPropertiesEnum.FULLTEXT_SEARCH].toLocaleLowerCase() : '')
            )
        },
        description: function (value: string) {
            return (
                value
                    .toLocaleLowerCase()
                    .includes(
                        filter[CodelistFilterInputs.VALUE_DESCRIPTION] ? filter[CodelistFilterInputs.VALUE_DESCRIPTION].toLocaleLowerCase() : '',
                    ) &&
                value
                    .toLocaleLowerCase()
                    .includes(filter[FilterPropertiesEnum.FULLTEXT_SEARCH] ? filter[FilterPropertiesEnum.FULLTEXT_SEARCH].toLocaleLowerCase() : '')
            )
        },
    })

    const filteredSiftData = codelistData?.results?.filter(testFilter)

    const updateEnum = useUpdateEnumType({
        mutation: {
            onSuccess(variables, context) {
                queryClient.setQueryData(['codelists'], (oldData: EnumTypePreviewList | undefined) => {
                    if (oldData == null || oldData.results == null) return oldData

                    const itemToUpdateIndex = oldData.results.findIndex((item) => item.code === context.data.code)
                    return {
                        results: [...oldData.results.slice(0, itemToUpdateIndex), context.data, ...oldData.results.slice(itemToUpdateIndex + 1)],
                    }
                })
            },
        },
    })

    const createEnum = useInsertEnumType({
        mutation: {
            onSuccess(variables, context) {
                queryClient.setQueryData(['codelists'], (oldData: EnumTypePreviewList | undefined) => {
                    if (oldData == null || oldData.results == null) return oldData

                    const itemToUpdateIndex = oldData.results.findIndex((item) => item.code === context.data.code)
                    return {
                        results: [context.data, ...oldData.results.slice(0, itemToUpdateIndex), ...oldData.results.slice(itemToUpdateIndex + 1)],
                    }
                })
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
            filteredData={{ results: filteredSiftData }}
            mutations={{ updateEnum, deleteEnum, createEnum, validateEnum }}
            isLoading={isLoading}
            isError={isError}
        />
    )
}