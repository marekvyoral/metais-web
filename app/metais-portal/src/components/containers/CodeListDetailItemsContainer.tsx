import { useState } from 'react'
import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ApiCodelistItemList, useGetCodelistItems, useProcessItemAction } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { AttributeProfile, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { formatDateForDefaultValue } from '@isdd/metais-common/index'
import { PromiseStatus } from '@isdd/metais-common/types/api'

import { ApiCodeListItemsActions } from '@/componentHelpers/codeList'

export interface itemActionError {
    itemCode: string
    message: string
}
export interface CodeListDetailItemsViewProps {
    code: string
    items?: ApiCodelistItemList
    attributeProfile?: AttributeProfile
    isLoading: boolean
    isLoadingItemAction: boolean
    isError: boolean
    itemActionErrors: itemActionError[]
    isSuccessItemActionMutation: boolean
    filter: IFilter
    workingLanguage: string
    invalidateCodeListDetailCache: () => void
    handleFilterChange: (filter: IFilter) => void
    handleMarkForPublish: (itemCodes: string[]) => void
    handleSetDates: (itemCodes: string[], validFrom: string, effectiveFrom: string) => void
}

export interface CodeListDetailItemsContainerProps {
    code: string
    workingLanguage: string
    invalidateCodeListDetailCache: () => void
    View: React.FC<CodeListDetailItemsViewProps>
}

export enum CodeListFilterEffective {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
}

export const defaultFilterValues = {
    state: undefined,
    effective: CodeListFilterEffective.TRUE,
}

export interface CodeListDetailFilterData extends IFilterParams, IFilter {
    state?: string
    effective?: string
}

export interface CodeListDetailItemsFilterData extends IFilterParams, IFilter {
    action?: string[]
    lastModifiedBy?: string[]
    fromDate?: string
    toDate?: string
}

export const CodeListDetailItemsContainer: React.FC<CodeListDetailItemsContainerProps> = ({
    code,
    workingLanguage,
    invalidateCodeListDetailCache,
    View,
}) => {
    const { filter, handleFilterChange } = useFilterParams<CodeListDetailFilterData>({
        sort: [
            {
                orderBy: 'itemCode',
                sortDirection: SortType.DESC,
            },
        ],
        ...defaultFilterValues,
    })
    const [mutationErrors, setMutationErrors] = useState<itemActionError[]>([])

    const {
        isFetching: isLoadingAttributeProfile,
        isError: isErrorAttributeProfile,
        data: attributeProfile,
    } = useGetAttributeProfile('Gui_Profil_ZC')

    const {
        isFetching: isLoadingItems,
        isError: isErrorItems,
        data: itemsData,
    } = useGetCodelistItems(code ?? '', {
        language: 'sk',
        pageNumber: filter.pageNumber ?? BASE_PAGE_NUMBER,
        perPage: filter.pageSize ?? BASE_PAGE_SIZE,
        ...(filter.state && { state: filter.state }),
        ...(filter.effective && { effective: filter.effective === CodeListFilterEffective.TRUE }),
        sortBy: filter.sort?.[0]?.orderBy ?? 'itemCode',
        ascending: filter.sort?.[0]?.sortDirection === SortType.DESC ?? false,
    })

    const mutationItemAction = useProcessItemAction()

    const handleMarkForPublish = (itemCodes: string[]) => {
        Promise.allSettled(
            itemCodes.map(async (itemCode) => {
                return mutationItemAction.mutateAsync({
                    code,
                    itemCode,
                    params: {
                        action: ApiCodeListItemsActions.CODELIST_ITEMS_TO_PUBLISH,
                    },
                })
            }),
        ).then((results) => {
            const errors = results
                .filter((result) => result.status === PromiseStatus.REJECTED)
                .map((error, index) => {
                    return { itemCode: itemCodes[index], message: JSON.parse((error as PromiseRejectedResult).reason.message).message }
                })
            setMutationErrors(errors)
        })

        invalidateCodeListDetailCache()
    }

    const handleSetDates = async (itemCodes: string[], validFrom: string, effectiveFrom: string) => {
        Promise.allSettled(
            itemCodes.map(async (itemCode) => {
                return mutationItemAction.mutateAsync({
                    code,
                    itemCode,
                    params: {
                        action: ApiCodeListItemsActions.SET_DATES,
                        effectiveFrom: formatDateForDefaultValue(validFrom, 'dd.MM.yyyy'),
                        validFrom: formatDateForDefaultValue(effectiveFrom, 'dd.MM.yyyy'),
                    },
                })
            }),
        ).then((results) => {
            const errors = results
                .filter((result) => result.status === PromiseStatus.REJECTED)
                .map((error, index) => {
                    return { itemCode: itemCodes[index], message: JSON.parse((error as PromiseRejectedResult).reason.message).message }
                })
            setMutationErrors(errors)
        })

        invalidateCodeListDetailCache()
    }

    const isLoading = [isLoadingItems, isLoadingAttributeProfile].some((item) => item)
    const isError = [isErrorItems, isErrorAttributeProfile, mutationItemAction.isError].some((item) => item)

    return (
        <View
            code={code}
            items={itemsData}
            attributeProfile={attributeProfile}
            isLoading={isLoading}
            isLoadingItemAction={mutationItemAction.isLoading}
            isError={isError}
            itemActionErrors={mutationErrors}
            isSuccessItemActionMutation={mutationItemAction.isSuccess}
            workingLanguage={workingLanguage}
            filter={filter}
            invalidateCodeListDetailCache={invalidateCodeListDetailCache}
            handleFilterChange={handleFilterChange}
            handleMarkForPublish={handleMarkForPublish}
            handleSetDates={handleSetDates}
        />
    )
}
