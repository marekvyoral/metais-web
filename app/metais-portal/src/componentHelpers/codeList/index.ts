import {
    ApiCodelistContactData,
    ApiCodelistItem,
    ApiCodelistManager,
    ApiCodelistName,
    ApiCodelistPreview,
} from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { formatDateForDefaultValue, formatDateTimeForDefaultValue } from '@isdd/metais-common/index'

import { IFieldTextRow } from '@/components/views/codeLists/CodeListEditView'
import { IItemForm } from '@/components/views/codeLists/components/modals/ItemFormModal/ItemFormModal'

export const API_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS"
export const DEFAULT_EMPTY_NOTE: IFieldTextRow[] = [{ id: 0, text: '' }]

export interface IEditCodeListForm {
    base?: boolean
    code: string
    codeListNames: ApiCodelistName[]
    newCodeListName?: ApiCodelistName
    codeListNotes?: IFieldTextRow[]
    codeListSource?: IFieldTextRow[]
    mainGestor?: ApiCodelistManager[]
    newMainGestor?: ApiCodelistManager
    nextGestor?: ApiCodelistManager[]
    refIndicator?: string
    effectiveFrom?: string
    effectiveTo?: string
    name: string
    lastName: string
    email: string
    phone: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any
}

export enum ApiCodeListActions {
    TEMPORAL_CODELIST_TO_ISVS_PROCESSING = 'temporalCodelistToIsvsProcessing',
    TEMPORAL_CODELIST_TO_PUBLISHED = 'temporalCodelistToPublished',
    TEMPORAL_CODELIST_TO_READY_TO_PUBLISH = 'temporalCodelistToReadyToPublish',
    TEMPORAL_CODELIST_TO_UPDATING = 'temporalCodelistToUpdating',
    CODELIST_ITEMS_TO_PUBLISH = 'codelistItemsToPublish',
}

export enum ApiCodeListItemsActions {
    SET_DATES = 'setDates',
    CODELIST_ITEM_TO_READY_TO_PUBLISH = 'codelistItemToReadyToPublish',
    CODELIST_ITEM_BACK_FROM_READY_TO_PUBLISH = 'codelistItemBackFromReadyToPublish',
}

export enum CodeListItemState {
    NEW = 'NEW',
    READY_TO_PUBLISH = 'READY_TO_PUBLISH',
    PUBLISHED = 'PUBLISHED',
    UPDATING = 'UPDATING',
}

interface ApiDataObjectBase {
    id?: number
    language?: string
}

const pushOrUpdate = <T extends ApiDataObjectBase>(data: T[] | undefined, newValue: T, language: string) => {
    if (!Array.isArray(data)) {
        return [newValue]
    }

    if (newValue.language) {
        const oldCurrentLanguageData = data.find((item) => item.language === language)
        if (oldCurrentLanguageData) {
            return [
                ...data.filter((item) => item.language !== language),
                {
                    ...newValue,
                    id: oldCurrentLanguageData.id,
                },
            ]
        }
    }

    return [...data, newValue]
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

export const removeOtherLanguagesFromItem = (item: ApiCodelistItem, language: string): ApiCodelistItem => {
    return {
        ...item,
        codelistItemNames: item.codelistItemNames?.filter((data) => data.language === language),
        codelistItemAbbreviatedNames: item.codelistItemAbbreviatedNames?.filter((data) => data.language === language),
        codelistItemAdditionalContents: item.codelistItemAdditionalContents?.filter((data) => data.language === language),
        codelistItemExcludes: (item.codelistItemExcludes = item.codelistItemExcludes?.filter((data) => data.language === language)),
        codelistItemIncludes: (item.codelistItemIncludes = item.codelistItemIncludes?.filter((data) => data.language === language)),
        codelistItemIncludesAlso: (item.codelistItemIncludesAlso = item.codelistItemIncludesAlso?.filter((data) => data.language === language)),
        codelistItemLogicalOrders: (item.codelistItemLogicalOrders = item.codelistItemLogicalOrders?.filter((data) => data.language === language)),
        codelistItemNotes: (item.codelistItemNotes = item.codelistItemNotes?.filter((data) => data.language === language)),
        codelistItemShortenedNames: item.codelistItemShortenedNames?.filter((data) => data.language === language),
    }
}

export const mapFormToCodeListItem = (language: string, formItem: IItemForm, oldItem?: ApiCodelistItem): ApiCodelistItem => {
    const effectiveFrom = formItem.effectiveFrom ? formatDateTimeForDefaultValue(formItem.effectiveFrom, API_DATE_FORMAT) : undefined
    const effectiveTo = formItem.effectiveTo ? formatDateTimeForDefaultValue(formItem.effectiveTo, API_DATE_FORMAT) : undefined

    const newItem = {
        ...oldItem,
        temporal: false,
        codelistItemState: CodeListItemState.NEW,
        published: false,
    } as ApiCodelistItem

    newItem.id = formItem.id ? Number(formItem.id) : undefined
    newItem.itemCode = formItem.code
    newItem.itemUri = formItem.refIdent
    newItem.validFrom = formItem.effectiveFrom ? formatDateTimeForDefaultValue(formItem.effectiveFrom, API_DATE_FORMAT) : ''

    if (formItem.name) {
        newItem.codelistItemNames = pushOrUpdate(newItem.codelistItemNames, { value: formItem.name, language, effectiveFrom, effectiveTo }, language)
    }
    if (formItem.shortenedName) {
        newItem.codelistItemShortenedNames = pushOrUpdate(
            newItem.codelistItemShortenedNames,
            {
                value: formItem.shortenedName,
                language,
                effectiveFrom,
                effectiveTo,
            },
            language,
        )
    }
    if (formItem.abbreviatedName) {
        newItem.codelistItemAbbreviatedNames = pushOrUpdate(
            newItem.codelistItemAbbreviatedNames,
            {
                value: formItem.abbreviatedName,
                language,
                effectiveFrom,
                effectiveTo,
            },
            language,
        )
    }
    if (formItem.additionalContent) {
        newItem.codelistItemAdditionalContents = pushOrUpdate(
            newItem.codelistItemAdditionalContents,
            {
                value: formItem.additionalContent,
                language,
                effectiveFrom,
                effectiveTo,
            },
            language,
        )
    }
    if (formItem.exclude) {
        newItem.codelistItemExcludes = pushOrUpdate(
            newItem.codelistItemExcludes,
            {
                value: formItem.exclude,
                language,
                effectiveFrom,
                effectiveTo,
            },
            language,
        )
    }
    if (formItem.include) {
        newItem.codelistItemIncludes = pushOrUpdate(
            newItem.codelistItemIncludes,
            {
                value: formItem.include,
                language,
                effectiveFrom,
                effectiveTo,
            },
            language,
        )
    }
    if (formItem.includeAlso) {
        newItem.codelistItemIncludesAlso = pushOrUpdate(
            newItem.codelistItemIncludesAlso,
            {
                value: formItem.includeAlso,
                language,
                effectiveFrom,
                effectiveTo,
            },
            language,
        )
    }
    if (formItem.order) {
        newItem.codelistItemLogicalOrders = pushOrUpdate(newItem.codelistItemLogicalOrders, { value: String(formItem.order), language }, language)
    }
    if (formItem.note) {
        newItem.codelistItemNotes = pushOrUpdate(newItem.codelistItemNotes, { value: formItem.note, language }, language)
    }
    if (formItem.unitOfMeasure) {
        newItem.codelistItemUnitsOfMeasure = [
            {
                value: formItem.unitOfMeasure,
                effectiveFrom,
                effectiveTo,
            },
        ]
    }
    newItem.codelistItemLegislativeValidities = [
        {
            validityValue: Boolean(formItem.legislativeValidity),
            effectiveFrom,
            effectiveTo,
        },
    ]
    newItem.codelistItemValidities = [
        {
            effectiveFrom,
            effectiveFromValue: effectiveFrom,
            effectiveTo,
            effectiveToValue: effectiveTo,
        },
    ]

    return newItem
}

export const mapCodeListToEditForm = (code: ApiCodelistPreview | undefined, language: string): IEditCodeListForm | undefined => {
    if (!code) return undefined
    return {
        base: code.base || false,
        code: code.code ?? '',
        codeListNames:
            code.codelistNames
                ?.filter((item) => item.language === language)
                .map((name) => ({
                    ...name,
                    effectiveFrom: name.effectiveFrom ? formatDateForDefaultValue(name.effectiveFrom) : '',
                    effectiveTo: name.effectiveTo ? formatDateForDefaultValue(name.effectiveTo) : '',
                })) ?? [],
        codeListNotes:
            code?.codelistNotes?.length === 0
                ? DEFAULT_EMPTY_NOTE
                : code.codelistNotes
                      ?.filter((item) => item.language === language)
                      ?.map((note) => ({
                          id: note.id ?? 0,
                          text: note.value ?? '',
                      })) ?? DEFAULT_EMPTY_NOTE,
        codeListSource:
            code.codelistSource?.length === 0
                ? DEFAULT_EMPTY_NOTE
                : code.codelistSource?.map((item, index) => ({
                      id: index,
                      text: item,
                  })) ?? DEFAULT_EMPTY_NOTE,
        mainGestor: code.mainCodelistManagers?.map((gestor) => ({
            ...gestor,
            effectiveFrom: gestor.effectiveFrom ? formatDateForDefaultValue(gestor.effectiveFrom) : '',
            effectiveTo: gestor.effectiveTo ? formatDateForDefaultValue(gestor.effectiveTo) : '',
        })),
        newMainGestor: undefined,
        nextGestor: code.codelistManagers?.map((gestor) => ({
            ...gestor,
            effectiveFrom: gestor.effectiveFrom ? formatDateForDefaultValue(gestor.effectiveFrom) : '',
            effectiveTo: gestor.effectiveTo ? formatDateForDefaultValue(gestor.effectiveTo) : '',
        })),
        refIndicator: code.uri ?? '',
        name: code.contactFirstName ?? '',
        lastName: code.contactSurname ?? '',
        phone: code.contactPhone ?? '',
        email: code.contactMail ?? '',
        effectiveFrom: formatDateForDefaultValue(code.effectiveFrom ?? ''),
        effectiveTo: formatDateForDefaultValue(code.effectiveTo ?? ''),
    }
}

const mapFormMainGestorsToApi = (formData: IEditCodeListForm, code: ApiCodelistPreview | undefined): ApiCodelistManager[] => {
    const newGestors: ApiCodelistManager[] = []
    formData.mainGestor?.forEach((gestor, index) => {
        if (code?.mainCodelistManagers?.[index] && code?.mainCodelistManagers[index].value !== gestor?.value) {
            // is updated, remove ID and set new value
            newGestors[index] = {
                value: gestor.value,
            }
        } else {
            // is old
            newGestors[index] = code?.mainCodelistManagers?.[index] ?? {}
        }
        newGestors[index].effectiveFrom = gestor.effectiveFrom ? formatDateTimeForDefaultValue(gestor.effectiveFrom, API_DATE_FORMAT) : ''
        newGestors[index].effectiveTo = gestor.effectiveTo ? formatDateTimeForDefaultValue(gestor.effectiveTo, API_DATE_FORMAT) : ''
    })
    if (formData.newMainGestor?.value) {
        newGestors.push({
            value: formData.newMainGestor.value,
            effectiveFrom: formData.newMainGestor.effectiveFrom
                ? formatDateTimeForDefaultValue(formData.newMainGestor.effectiveFrom, API_DATE_FORMAT)
                : '',
            effectiveTo: formData.newMainGestor.effectiveTo ? formatDateTimeForDefaultValue(formData.newMainGestor.effectiveTo, API_DATE_FORMAT) : '',
        })
    }
    return newGestors
}

const mapFormNextGestorsToApi = (formData: IEditCodeListForm, code: ApiCodelistPreview | undefined): ApiCodelistManager[] => {
    const newGestors: ApiCodelistManager[] = []
    formData.nextGestor?.forEach((gestor, index) => {
        if (code?.codelistManagers?.[index]?.value !== gestor?.value) {
            // is updated, remove ID and set new value
            newGestors[index] = {
                value: gestor.value,
            }
        } else {
            newGestors[index] = code?.codelistManagers?.[index] ?? {}
        }
        newGestors[index].effectiveFrom = gestor.effectiveFrom ? formatDateTimeForDefaultValue(gestor.effectiveFrom, API_DATE_FORMAT) : ''
        newGestors[index].effectiveTo = gestor.effectiveTo ? formatDateTimeForDefaultValue(gestor.effectiveTo, API_DATE_FORMAT) : ''
    })

    return newGestors
}

export const mapFormCodelistNamesToApi = (formData: IEditCodeListForm, code: ApiCodelistPreview | undefined, language: string): ApiCodelistName[] => {
    const otherLanguageNames = code?.codelistNames?.filter((name) => name.language !== language) ?? []
    const currentLanguageNames = formData.codeListNames?.length
        ? formData.codeListNames.map((item) => ({
              ...item,
              language,
              effectiveFrom: item.effectiveFrom ? formatDateTimeForDefaultValue(item.effectiveFrom, API_DATE_FORMAT) : '',
              effectiveTo: item.effectiveTo ? formatDateTimeForDefaultValue(item.effectiveTo, API_DATE_FORMAT) : '',
          }))
        : []
    const newNames = formData.newCodeListName?.value
        ? [
              {
                  ...formData.newCodeListName,
                  language,
                  effectiveFrom: formData.newCodeListName?.effectiveFrom
                      ? formatDateTimeForDefaultValue(formData.newCodeListName.effectiveFrom, API_DATE_FORMAT)
                      : '',
                  effectiveTo: formData.newCodeListName?.effectiveTo
                      ? formatDateTimeForDefaultValue(formData.newCodeListName.effectiveTo, API_DATE_FORMAT)
                      : '',
              },
          ]
        : []

    return [...otherLanguageNames, ...currentLanguageNames, ...newNames]
}

export const mapEditFormDataToCodeList = (
    formData: IEditCodeListForm,
    code: ApiCodelistPreview | undefined,
    language: string,
): ApiCodelistPreview => {
    return {
        ...code,
        base: formData.base,
        code: formData.code,
        codelistNames: mapFormCodelistNamesToApi(formData, code, language),
        mainCodelistManagers: mapFormMainGestorsToApi(formData, code),
        codelistManagers: mapFormNextGestorsToApi(formData, code),
        codelistNotes: formData.codeListNotes?.filter((note) => note?.text !== '').map((note) => ({ id: note.id, value: note.text, language })),
        codelistSource: formData.codeListSource?.map((source) => source.text ?? ''),
        uri: formData.refIndicator,
        effectiveFrom: formData.effectiveFrom ? formatDateTimeForDefaultValue(formData.effectiveFrom, API_DATE_FORMAT) : '',
        effectiveTo: formData.effectiveTo ? formatDateTimeForDefaultValue(formData.effectiveTo, API_DATE_FORMAT) : '',
        contactFirstName: formData.name,
        contactSurname: formData.lastName,
        contactPhone: formData.phone,
        contactMail: formData.email,
    }
}

export const mapFormToContactData = (requestData: ApiCodelistPreview): ApiCodelistContactData => {
    return {
        code: requestData.code,
        contactFirstName: requestData.contactFirstName,
        contactSurname: requestData.contactSurname,
        contactMail: requestData.contactMail,
        contactPhone: requestData.contactPhone,
    }
}
