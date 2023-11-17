import { ApiCodelistItem } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { formatDateForDefaultValue, formatDateTimeForDefaultValue } from '@isdd/metais-common/index'

import { IItemForm } from '@/components/views/codeLists/components/modals/ItemFormModal/ItemFormModal'

export const _entityName = 'requestList'

export enum ApiCodeListActions {
    TEMPORAL_CODELIST_TO_ISVS_PROCESSING = 'temporalCodelistToIsvsProcessing',
    TEMPORAL_CODELIST_TO_PUBLISHED = 'temporalCodelistToPublished',
    TEMPORAL_CODELIST_TO_READY_TO_PUBLISH = 'temporalCodelistToReadyToPublish',
    TEMPORAL_CODELIST_TO_UPDATING = 'temporalCodelistToUpdating',
}

export enum ApiCodeListItemsActions {
    CODELIST_ITEMS_TO_PUBLISH = 'codelistItemsToPublish',
    SET_DATES = 'setDates',
    CODELIST_ITEM_BACK_FROM_READY_TO_PUBLISH = 'codelistItemBackFromReadyToPublish',
}

export enum CodeListItemState {
    NEW = 'NEW',
    READY_TO_PUBLISH = 'READY_TO_PUBLISH',
    PUBLISHED = 'PUBLISHED',
    UPDATING = 'UPDATING',
}

const pushOrInit = (currentValue: object[] | undefined, newValue: object) => {
    if (Array.isArray(currentValue)) {
        currentValue.push(newValue)
    }
    return [newValue]
}

const removeLanguageData = (item: ApiCodelistItem, language: string): ApiCodelistItem => {
    if (item.codelistItemNames) item.codelistItemNames = item.codelistItemNames?.filter((data) => data.language !== language)
    if (item.codelistItemAbbreviatedNames)
        item.codelistItemAbbreviatedNames = item.codelistItemAbbreviatedNames?.filter((data) => data.language !== language)
    if (item.codelistItemAdditionalContents)
        item.codelistItemAdditionalContents = item.codelistItemAdditionalContents?.filter((data) => data.language !== language)
    if (item.codelistItemExcludes) item.codelistItemExcludes = item.codelistItemExcludes?.filter((data) => data.language !== language)
    if (item.codelistItemIncludes) item.codelistItemIncludes = item.codelistItemIncludes?.filter((data) => data.language !== language)
    if (item.codelistItemIncludesAlso) item.codelistItemIncludesAlso = item.codelistItemIncludesAlso?.filter((data) => data.language !== language)
    if (item.codelistItemLogicalOrders) item.codelistItemLogicalOrders = item.codelistItemLogicalOrders?.filter((data) => data.language !== language)
    if (item.codelistItemNotes) item.codelistItemNotes = item.codelistItemNotes?.filter((data) => data.language !== language)
    if (item.codelistItemShortenedNames)
        item.codelistItemShortenedNames = item.codelistItemShortenedNames?.filter((data) => data.language !== language)

    return item
}

export const mapCodeListItemToForm = (apiItem: ApiCodelistItem, language: string): IItemForm => {
    const effectiveFrom = apiItem.codelistItemNames?.find((item) => item.language === language)?.effectiveFrom ?? null
    const effectiveTo = apiItem.codelistItemNames?.find((item) => item.language === language)?.effectiveTo ?? null
    const orderValue = apiItem.codelistItemLogicalOrders?.find((item) => item.language === language)?.value ?? ''

    return {
        id: apiItem.id,
        code: apiItem.itemCode ?? '',
        name: apiItem.codelistItemNames?.find((item) => item.language === language)?.value ?? '',
        shortenedName: apiItem.codelistItemShortenedNames?.find((item) => item.language === language)?.value ?? '',
        abbreviatedName: apiItem.codelistItemAbbreviatedNames?.find((item) => item.language === language)?.value ?? '',
        additionalContent: apiItem.codelistItemAdditionalContents?.find((item) => item.language === language)?.value ?? '',
        unitOfMeasure: apiItem.codelistItemUnitsOfMeasure?.[0]?.value ?? '',
        note: apiItem.codelistItemNotes?.find((item) => item.language === language)?.value ?? '',
        order: orderValue !== '' ? Number(orderValue) : undefined,
        refIdent: apiItem.itemUri ?? '',
        exclude: apiItem.codelistItemExcludes?.find((item) => item.language === language)?.value ?? '',
        include: apiItem.codelistItemIncludes?.find((item) => item.language === language)?.value ?? '',
        includeAlso: apiItem.codelistItemIncludesAlso?.find((item) => item.language === language)?.value ?? '',
        validFrom: apiItem.validFrom ? formatDateForDefaultValue(apiItem.validFrom) : '',
        effectiveFrom: effectiveFrom ? formatDateForDefaultValue(effectiveFrom) : '',
        effectiveTo: effectiveTo ? formatDateForDefaultValue(effectiveTo) : '',
        legislativeValidity: apiItem.codelistItemLegislativeValidities?.[0]?.validityValue,
    } as IItemForm
}

export const mapToCodeListDetail = (language: string, item: IItemForm, oldItem?: ApiCodelistItem): ApiCodelistItem => {
    const apiDateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS"
    const effectiveFrom = item.effectiveFrom ? formatDateTimeForDefaultValue(item.effectiveFrom, apiDateFormat) : undefined
    const effectiveTo = item.effectiveTo ? formatDateTimeForDefaultValue(item.effectiveTo, apiDateFormat) : undefined

    let newItem = {
        temporal: false,
        codelistItemState: CodeListItemState.PUBLISHED,
        published: false,
    } as ApiCodelistItem

    if (oldItem) {
        newItem = {
            ...oldItem,
            temporal: oldItem.temporal,
            codelistItemState: oldItem.codelistItemState,
            published: oldItem.published,
        } as ApiCodelistItem

        newItem = removeLanguageData(newItem, language)
    }

    newItem.id = item.id ? Number(item.id) : undefined
    newItem.itemCode = item.code
    newItem.itemUri = item.refIdent
    newItem.validFrom = item.effectiveFrom ? formatDateTimeForDefaultValue(item.effectiveFrom, apiDateFormat) : ''

    if (item.name) {
        newItem.codelistItemNames = pushOrInit(newItem.codelistItemNames, { value: item.name, language, effectiveFrom, effectiveTo })
    }
    if (item.shortenedName) {
        newItem.codelistItemShortenedNames = pushOrInit(newItem.codelistItemShortenedNames, {
            value: item.shortenedName,
            language,
            effectiveFrom,
            effectiveTo,
        })
    }
    if (item.abbreviatedName) {
        newItem.codelistItemAbbreviatedNames = pushOrInit(newItem.codelistItemAbbreviatedNames, {
            value: item.abbreviatedName,
            language,
            effectiveFrom,
            effectiveTo,
        })
    }
    if (item.additionalContent) {
        newItem.codelistItemAdditionalContents = pushOrInit(newItem.codelistItemAdditionalContents, {
            value: item.additionalContent,
            language,
            effectiveFrom,
            effectiveTo,
        })
    }
    if (item.exclude) {
        newItem.codelistItemExcludes = pushOrInit(newItem.codelistItemExcludes, { value: item.exclude, language, effectiveFrom, effectiveTo })
    }
    if (item.include) {
        newItem.codelistItemIncludes = pushOrInit(newItem.codelistItemIncludes, { value: item.include, language, effectiveFrom, effectiveTo })
    }
    if (item.includeAlso) {
        newItem.codelistItemIncludesAlso = pushOrInit(newItem.codelistItemIncludesAlso, {
            value: item.includeAlso,
            language,
            effectiveFrom,
            effectiveTo,
        })
    }
    if (item.order) {
        newItem.codelistItemLogicalOrders = pushOrInit(newItem.codelistItemLogicalOrders, { value: String(item.order), language })
    }
    if (item.note) {
        newItem.codelistItemNotes = pushOrInit(newItem.codelistItemNotes, { value: item.note, language })
    }
    if (item.unitOfMeasure) {
        newItem.codelistItemUnitsOfMeasure = pushOrInit(newItem.codelistItemUnitsOfMeasure, { value: item.unitOfMeasure, effectiveFrom, effectiveTo })
    }
    newItem.codelistItemLegislativeValidities = pushOrInit(newItem.codelistItemLegislativeValidities, {
        validityValue: Boolean(item.legislativeValidity),
        effectiveFrom,
        effectiveTo,
    })
    newItem.codelistItemValidities = pushOrInit(newItem.codelistItemValidities, {
        effectiveFrom,
        effectiveFromValue: effectiveFrom,
        effectiveTo,
        effectiveToValue: effectiveTo,
    })

    return newItem
}

export const getErrorTranslateKeys = (errors: { message: string }[]): string[] => {
    return errors
        .filter((error) => !!error && error.message)
        .map((error) => {
            const message = JSON.parse(error.message)
            return `errors.codeList.${message.message}`
        })
}
