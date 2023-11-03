import { IFilter, SortType } from '@isdd/idsk-ui-kit/types'
import { IFilterParams, useFilterParams } from '@isdd/metais-common/hooks/useFilter'
import {
    ApiCodelistItemList,
    useGetCodelistItems,
    useGetTemporalCodelistItemWithLockHook,
    useProcessItemAction,
    useCreateCodelistItem,
    useUpdateCodelistItemLangExtended,
    useUpdateAndUnlockTemporalCodelistItem,
    ApiCodelistItem,
    useCreateNewCodelistItemLangExtended,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { BASE_PAGE_NUMBER, BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { AttributeProfile, useGetAttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useMutation } from '@tanstack/react-query'
import { formatDateForDefaultValue } from '@isdd/metais-common/index'
import { CodeListItemState } from '@isdd/metais-common/hooks/permissions/useCodeListPermissions'
import { useState } from 'react'

import { IItemForm } from '@/components/views/codeLists/components/modals/ItemForm/ItemForm'
import { mapCodeListItemToForm, mapToCodeListDetail } from '@/componentHelpers/codeList'

export interface CodeListDetailItemsViewProps {
    items?: ApiCodelistItemList
    attributeProfile?: AttributeProfile
    isLoading: boolean
    isError: boolean
    isSuccessMutation: boolean
    isLoadingEditItemSubmit: boolean
    isErrorEditItemSubmit: boolean
    isSuccessEditItemSubmit: boolean
    filter: IFilter
    workingLanguage: string
    invalidateCodeListDetailCache: () => void
    handleFilterChange: (filter: IFilter) => void
    handleMarkForPublish: (itemCodes: string[]) => void
    handleSetDates: (itemCodes: string[], validFrom: string, effectiveFrom: string) => void
    handleStartItemEdit: (itemId: number) => Promise<IItemForm>
    handleSubmitItem: (form: IItemForm) => void
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
    const [editingApiItem, setEditingApiItem] = useState<ApiCodelistItem | undefined>(undefined)

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

    const mutationItemAction = useProcessItemAction()
    const mutationCreateItem = useCreateCodelistItem()
    const mutationUpdateAndUnlockItem = useUpdateAndUnlockTemporalCodelistItem()
    const mutationUpdateItemLangExtended = useUpdateCodelistItemLangExtended()
    const mutationCreateItemLangExtended = useCreateNewCodelistItemLangExtended()
    const getTemporalItemWithLock = useGetTemporalCodelistItemWithLockHook()

    const itemsActionsMutation = useMutation({
        mutationFn: (variables: { itemCodes: string[]; action: string; effectiveFrom?: string; validFrom?: string }) => {
            const { itemCodes, action, effectiveFrom, validFrom } = variables
            const promises = itemCodes.map((itemCode) =>
                mutationItemAction.mutate({
                    code,
                    itemCode,
                    params: { action, ...(effectiveFrom && { effectiveFrom }), ...(validFrom && { validFrom }) },
                }),
            )
            return Promise.all(promises)
        },
    })

    const handleStartItemEdit = async (itemId: number): Promise<IItemForm> => {
        const existingItem = itemsData?.codelistsItems?.find((item) => item.id === itemId)
        const itemCode = existingItem?.itemCode || ''

        if (existingItem?.codelistItemState === CodeListItemState.READY_TO_PUBLISH) {
            mutationItemAction.mutate({ code, itemCode, params: { action: 'codelistItemBackFromReadyToPublish' } })
        }

        const item = await getTemporalItemWithLock(code, itemCode)
        setEditingApiItem(item)

        return mapCodeListItemToForm(item, workingLanguage)
    }

    const handleSubmitItem = (form: IItemForm) => {
        if (form.id) {
            // edit
            const item = mapToCodeListDetail(workingLanguage, form, editingApiItem)
            const itemCode = item.itemCode || ''
            if (editingApiItem?.codelistItemNames?.some((name) => name.language === workingLanguage)) {
                // update existing
                mutationUpdateAndUnlockItem.mutate({ code, itemCode, data: item })
            } else {
                // add language version
                mutationCreateItemLangExtended.mutate({ code, itemCode, data: item, actualLang: workingLanguage })
                mutationUpdateItemLangExtended.mutate({ code, itemCode, data: item })
            }
        } else {
            // create
            const item = mapToCodeListDetail(workingLanguage, form)
            mutationCreateItem.mutate({ code, data: item })
        }

        refetchItems()
        // close popup / show feedback?
    }

    const handleMarkForPublish = (itemCodes: string[]) => {
        itemsActionsMutation.mutate({ itemCodes, action: 'codelistItemToReadyToPublish' })
        refetchItems()
    }

    const handleSetDates = (itemCodes: string[], validFrom: string, effectiveFrom: string) => {
        itemsActionsMutation.mutate({
            itemCodes,
            action: 'setDates',
            validFrom: formatDateForDefaultValue(validFrom, 'dd.MM.yyyy'),
            effectiveFrom: formatDateForDefaultValue(effectiveFrom, 'dd.MM.yyyy'),
        })
        refetchItems()
    }

    const isLoadingEditItemSubmit = [
        mutationCreateItem,
        mutationUpdateAndUnlockItem,
        mutationUpdateItemLangExtended,
        mutationCreateItemLangExtended,
    ].some((item) => item.isLoading)
    const isErrorEditItemSubmit = [
        mutationCreateItem,
        mutationUpdateAndUnlockItem,
        mutationUpdateItemLangExtended,
        mutationCreateItemLangExtended,
    ].some((item) => item.isError)
    const isSuccessEditItemSubmit = [
        mutationCreateItem,
        mutationUpdateAndUnlockItem,
        mutationUpdateItemLangExtended,
        mutationCreateItemLangExtended,
    ].some((item) => item.isSuccess)

    const isLoading = [
        isLoadingItems,
        isLoadingAttributeProfile,
        mutationItemAction.isLoading,
        isLoadingEditItemSubmit,
        itemsActionsMutation.isLoading,
    ].some((item) => item)
    const isError = [isErrorItems, isErrorAttributeProfile, isErrorEditItemSubmit, itemsActionsMutation.isError].some((item) => item)
    const isSuccessMutation = [mutationItemAction.isSuccess, itemsActionsMutation.isSuccess].some((item) => item)

    return (
        <View
            items={itemsData}
            attributeProfile={attributeProfile}
            isLoading={isLoading}
            isError={isError}
            // errorItemAction={errorItemAction}
            isSuccessMutation={isSuccessMutation}
            isLoadingEditItemSubmit={isLoadingEditItemSubmit}
            isErrorEditItemSubmit={isErrorEditItemSubmit}
            isSuccessEditItemSubmit={isSuccessEditItemSubmit}
            workingLanguage={workingLanguage}
            filter={filter}
            invalidateCodeListDetailCache={invalidateCodeListDetailCache}
            handleFilterChange={handleFilterChange}
            handleMarkForPublish={handleMarkForPublish}
            handleSetDates={handleSetDates}
            handleStartItemEdit={handleStartItemEdit}
            handleSubmitItem={handleSubmitItem}
        />
    )
}
