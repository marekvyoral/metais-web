import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import { ApiCodelistItemList, useGetCodelistItems, useProcessItemRequestAction } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { AttributeProfile, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useMutation } from '@tanstack/react-query'
import { formatDateForDefaultValue } from '@isdd/metais-common/index'

export interface CodeListDetailItemsViewProps {
    items?: ApiCodelistItemList
    attributeProfile?: AttributeProfile
    isLoading: boolean
    isError: boolean
    isErrorMutation: boolean
    isSuccessMutation: boolean
    filter: IFilter
    workingLanguage: string
    handleFilterChange: (filter: IFilter) => void
    handleMarkForPublish: (ids: number[]) => void
    handleSetDates: (ids: number[], validFrom: string, effectiveFrom: string) => void
}

export interface CodeListDetailItemsContainerProps {
    code: string
    workingLanguage: string
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

export const CodeListDetailItemsContainer: React.FC<CodeListDetailItemsContainerProps> = ({ code, workingLanguage, View }) => {
    const { filter, handleFilterChange } = useFilterParams<CodeListDetailFilterData>({
        sort: [
            {
                orderBy: 'itemCode',
                sortDirection: SortType.DESC,
            },
        ],
        ...defaultFilterValues,
    })

    const { isLoading: isLoadingAttributeProfile, isError: isErrorAttributeProfile, data: attributeProfile } = useGetAttributeProfile('Gui_Profil_ZC')

    const {
        isLoading: isLoadingItems,
        isError: isErrorItems,
        refetch: refetchItems,
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

    const {
        mutate: mutateItemAction,
        isLoading: isLoadingItemAction,
        isError: isErrorItemAction,
        isSuccess: isSuccessItemAction,
    } = useProcessItemRequestAction()

    const markForPublishMutation = useMutation({
        mutationFn: (variables: { ids: string[]; action: string; effectiveFrom?: string; validFrom?: string }) => {
            const { ids, action, effectiveFrom, validFrom } = variables
            const promises = ids.map((id) =>
                mutateItemAction({
                    code,
                    itemCode: id,
                    params: { action, ...(effectiveFrom && { effectiveFrom }), ...(validFrom && { validFrom }) },
                }),
            )
            return Promise.all(promises)
        },
    })

    const handleMarkForPublish = (ids: number[]) => {
        const stringIds = ids.map((id) => String(id))
        markForPublishMutation.mutate({ ids: stringIds, action: 'codelistItemToReadyToPublish' })
        refetchItems()
    }

    const handleSetDates = (ids: number[], validFrom: string, effectiveFrom: string) => {
        const stringIds = ids.map((id) => String(id))
        markForPublishMutation.mutate({
            ids: stringIds,
            action: 'setDates',
            validFrom: formatDateForDefaultValue(validFrom, 'dd.MM.yyyy'),
            effectiveFrom: formatDateForDefaultValue(effectiveFrom, 'dd.MM.yyyy'),
        })
        refetchItems()
    }

    const isLoading = [isLoadingItems, isLoadingAttributeProfile, isLoadingItemAction].some((item) => item)
    const isError = [isErrorItems, isErrorAttributeProfile].some((item) => item)
    const isErrorMutation = [isErrorItemAction].some((item) => item)
    const isSuccessMutation = [isSuccessItemAction].some((item) => item)

    return (
        <View
            items={itemsData}
            attributeProfile={attributeProfile}
            isLoading={isLoading}
            isError={isError}
            isErrorMutation={isErrorMutation}
            isSuccessMutation={isSuccessMutation}
            workingLanguage={workingLanguage}
            filter={filter}
            handleFilterChange={handleFilterChange}
            handleMarkForPublish={handleMarkForPublish}
            handleSetDates={handleSetDates}
        />
    )
}
