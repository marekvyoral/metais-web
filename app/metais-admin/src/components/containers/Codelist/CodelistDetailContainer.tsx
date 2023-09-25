import { IFilter } from '@isdd/idsk-ui-kit/types'
import { EnumType, useDeleteEnumItem, useGetEnum, useInsertEnumItem, useUpdateEnumItem, useValidEnumItem } from '@isdd/metais-common/api'
import { latiniseString } from '@isdd/metais-common/componentHelpers/filter/feFilters'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters, UseMutationResult } from '@tanstack/react-query'
import React, { useMemo } from 'react'
import sift from 'sift'

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

    const detailFilter = sift({
        code: function (value: string) {
            return (
                latiniseString(value).includes(
                    filter[CodelistDetailFilterInputs.CODE] ? latiniseString(filter[CodelistDetailFilterInputs.CODE]) : '',
                ) &&
                latiniseString(value).includes(
                    filter[FilterPropertiesEnum.FULLTEXT_SEARCH] ? latiniseString(filter[FilterPropertiesEnum.FULLTEXT_SEARCH]) : '',
                )
            )
        },
        value: function (value: string) {
            return (
                latiniseString(value).includes(
                    filter[CodelistDetailFilterInputs.VALUE] ? latiniseString(filter[CodelistDetailFilterInputs.VALUE]) : '',
                ) &&
                latiniseString(value).includes(
                    filter[FilterPropertiesEnum.FULLTEXT_SEARCH] ? latiniseString(filter[FilterPropertiesEnum.FULLTEXT_SEARCH]) : '',
                )
            )
        },
        engValue: function (value: string) {
            return (
                latiniseString(value).includes(
                    filter[CodelistDetailFilterInputs.ENG_VALUE] ? latiniseString(filter[CodelistDetailFilterInputs.ENG_VALUE]) : '',
                ) &&
                latiniseString(value).includes(
                    filter[FilterPropertiesEnum.FULLTEXT_SEARCH] ? latiniseString(filter[FilterPropertiesEnum.FULLTEXT_SEARCH]) : '',
                )
            )
        },
        description: function (value: string) {
            return (
                latiniseString(value).includes(
                    filter[CodelistDetailFilterInputs.DESCRIPTION] ? latiniseString(filter[CodelistDetailFilterInputs.DESCRIPTION]) : '',
                ) &&
                latiniseString(value).includes(
                    filter[FilterPropertiesEnum.FULLTEXT_SEARCH] ? latiniseString(filter[FilterPropertiesEnum.FULLTEXT_SEARCH]) : '',
                )
            )
        },
        engDescription: function (value: string) {
            return (
                latiniseString(value).includes(
                    filter[CodelistDetailFilterInputs.ENG_DESCRIPTION] ? latiniseString(filter[CodelistDetailFilterInputs.ENG_DESCRIPTION]) : '',
                ) &&
                latiniseString(value).includes(
                    filter[FilterPropertiesEnum.FULLTEXT_SEARCH] ? latiniseString(filter[FilterPropertiesEnum.FULLTEXT_SEARCH]) : '',
                )
            )
        },
    })

    const filteredSiftData = useMemo(() => codelistDetailData?.enumItems?.filter(detailFilter), [codelistDetailData?.enumItems, detailFilter])

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
            filteredData={{ enumItems: filteredSiftData }}
            mutations={{ updateEnumItem, deleteEnumItem, createEnumItem, validateEnumItem }}
            isLoading={isLoading}
            isError={isError}
            refetch={refetch}
        />
    )
}
