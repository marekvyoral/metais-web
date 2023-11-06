import { ApiCodelistItem, ApiCodelistItemList, ApiCodelistPreview } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { formatDateForDefaultValue } from '@isdd/metais-common/index'
import { RequestListState } from '@isdd/metais-common/constants'
import { Roles } from '@isdd/metais-common/hooks/permissions/useRequestPermissions'
import { Group } from '@isdd/metais-common/contexts/auth/authContext'

import { INoteRow } from '@/components/views/requestLists/CreateRequestView'
import { IItemForm } from '@/components/views/requestLists/components/modalItem/ModalItem'

export const _entityName = 'requestList'
export interface IRequestForm {
    base?: boolean
    gid?: string
    codeListName: string
    codeListId: string
    resortCode: string
    mainGestor: string
    refIndicator?: string
    notes?: INoteRow[]
    name: string
    lastName: string
    phone: string
    email: string
    codeLists?: IItemForm[]
    startDate?: Date
    validDate?: Date
    codeListSate?: RequestListState
}

export const mapFormToSave = (formData: IRequestForm, language: string, uuid: string): ApiCodelistPreview => {
    const res: ApiCodelistPreview = {
        code: formData.codeListId,
        codelistState: RequestListState.NEW_REQUEST,
        base: formData.base,
        codelistNames: [
            {
                language: language,
                value: formData.codeListName,
            },
        ],
        codelistNotes: formData.notes?.map((item) => ({
            id: item.id,
            language: language,
            value: item.text,
        })),
        contactFirstName: formData.name,
        contactSurname: formData.lastName,
        contactPhone: formData.phone,
        contactMail: formData.email,
        resortCode: formData.resortCode,
        locked: false,
        lockedBy: 'lockedBy',
        temporal: false,
        apiCodelistItemList: {
            codelistsItemCount: formData.codeLists?.length ?? 0,
            codelistsItems: formData.codeLists?.map(
                (item) =>
                    ({
                        codelistItemAbbreviatedNames: item.shortcut
                            ? [
                                  {
                                      language: language,
                                      value: item.shortcut,
                                  },
                              ]
                            : [],
                        codelistItemAdditionalContents: item.addData
                            ? [
                                  {
                                      language: language,
                                      value: item.addData,
                                  },
                              ]
                            : [],
                        codelistItemExcludes: item.exclude
                            ? [
                                  {
                                      language: language,
                                      value: item.exclude,
                                  },
                              ]
                            : [],
                        codelistItemIncludes: item.contain
                            ? [
                                  {
                                      language: language,
                                      value: item.contain,
                                  },
                              ]
                            : [],
                        codelistItemIncludesAlso: item.alsoContain
                            ? [
                                  {
                                      language: language,
                                      value: item.alsoContain,
                                  },
                              ]
                            : [],
                        codelistItemLegislativeValidities: [
                            {
                                validityValue: true,
                            },
                        ],
                        codelistItemLogicalOrders: item.order
                            ? [
                                  {
                                      language: language,
                                      value: item.order.toString(),
                                  },
                              ]
                            : [],
                        codelistItemNotes: item.note
                            ? [
                                  {
                                      language: language,
                                      value: item.note,
                                  },
                              ]
                            : [],
                        codelistItemNames: item.codeName
                            ? [
                                  {
                                      language: language,
                                      value: item.codeName,
                                  },
                              ]
                            : [],
                        codelistItemShortenedNames: item.shortname
                            ? [
                                  {
                                      language: language,
                                      value: item.shortname,
                                  },
                              ]
                            : [],
                        codelistItemUnitsOfMeasure: item.unit
                            ? [
                                  {
                                      value: item.unit,
                                  },
                              ]
                            : [],
                        id: item.id?.toString().startsWith('create') ? undefined : item.id,
                        itemCode: item.codeItem,
                        itemUri: item.refident,
                        codelistItemState: item.state,
                        locked: false,
                        published: false,
                        temporal: false,
                        effectiveFrom: item.effectiveFrom ? formatDateForDefaultValue(item.effectiveFrom) : undefined,
                        validFrom: item.validDate && formatDateForDefaultValue(item.validDate),
                    } as ApiCodelistItem),
            ),
        },
        mainCodelistManagers: [
            {
                value: `${uuid}-${formData?.mainGestor}`,
                language: language,
                effectiveTo: undefined,
                effectiveFrom: new Date().toISOString(),
            },
        ],
        uri: formData.refIndicator,
        effectiveFrom: formData.startDate ? formatDateForDefaultValue(formData.startDate.toString()) : undefined,
        validFrom: formData.validDate ? formatDateForDefaultValue(formData.validDate.toString()) : undefined,
    }

    return res
}

export const mapCodeListToForm = (codeList: ApiCodelistItem[], language: string): IItemForm[] => {
    return (
        codeList?.map(
            (code) =>
                ({
                    id: code.id,
                    codeItem: code.itemCode ?? '',
                    codeName: code.codelistItemNames?.find((item) => item.language === language)?.value ?? '',
                    shortname: code.codelistItemShortenedNames?.find((item) => item.language === language)?.value ?? '',
                    addData: code.codelistItemAdditionalContents?.find((item) => item.language === language)?.value ?? '',
                    unit: code.codelistItemUnitsOfMeasure?.find((item) => item.id === code.id)?.value ?? '',
                    note: code.codelistItemNotes?.find((item) => item.language === language)?.value ?? '',
                    order: Number.parseInt(code.codelistItemLogicalOrders?.find((item) => item.language === language)?.value ?? ''),
                    validDate: code.validFrom ? new Date(code.validFrom) : undefined,
                    refident: code.itemUri ?? '',
                    exclude: code.codelistItemExcludes?.find((item) => item.language === language)?.value ?? '',
                    contain: code.codelistItemIncludes?.find((item) => item.language === language)?.value ?? '',
                    alsoContain: code.codelistItemIncludesAlso?.find((item) => item.language === language)?.value ?? '',
                    effectiveFrom: code.validFrom ? formatDateForDefaultValue(code.validFrom) : undefined,
                    lockedBy: code.lockedBy ?? '',
                    lockedFrom: code.lockedFrom ? code.lockedFrom : undefined,
                } as IItemForm),
        ) ?? []
    )
}

export const mapToCodeListDetail = (language: string, item?: IItemForm): ApiCodelistItem | undefined => {
    if (!item) return undefined
    return {
        id: item.id,
        itemCode: item.codeItem,
        codelistItemNames: [{ value: item.codeName, language: language }],
        codelistItemShortenedNames: [{ value: item.shortname, language: language }],
        codelistItemAdditionalContents: [{ value: item.unit, language: language }],
        codelistItemUnitsOfMeasure: [{ value: item.unit }],
        codelistItemNotes: [{ value: item.note, language: language }],
        codelistItemLogicalOrders: [{ value: item.order, language: language }],
        itemUri: item.refident,
        codelistItemExcludes: [{ value: item.exclude, language: language }],
        codelistItemIncludes: [{ value: item.contain, language: language }],
        codelistItemIncludesAlso: [{ value: item.alsoContain, language: language }],
        validFrom: item.effectiveFrom,
        lockedBy: item.lockedBy,
        lockedFrom: item.lockedFrom,
    } as ApiCodelistItem
}

export const mapToForm = (language: string, itemList?: ApiCodelistItemList, data?: ApiCodelistPreview): IRequestForm => {
    return {
        base: data?.base,
        codeListId: data?.code ?? '',
        codeListName: data?.codelistNames?.find((item) => item.language === language)?.value ?? '',
        email: data?.contactMail ?? '',
        lastName: data?.contactSurname ?? '',
        name: data?.contactFirstName ?? '',
        phone: data?.contactPhone ?? '',
        resortCode: data?.resortCode ?? '',
        gid: data?.mainCodelistManagers?.[0]?.value ?? '',
        codeLists: mapCodeListToForm(itemList?.codelistsItems ?? [], language),
        notes: data?.codelistNotes?.map((item) => ({ text: item.value, id: item.id } as INoteRow)) ?? [],
        validDate: data?.validFrom ? new Date(data.validFrom) : undefined,
        startDate: data?.fromDate ? new Date(data.fromDate) : undefined,
        codeListSate: data?.codelistState ?? '',
    } as IRequestForm
}

export const getUUID = (dataRoles: Group[]): string => {
    const roleUuid = dataRoles.reduce((uuid, org) => {
        const roleRes = org.roles.find((role) => role.roleName === Roles.SZCHLGES || role.roleName === Roles.SZCVEDGES)
        return roleRes?.roleUuid ?? uuid
    }, '')

    return roleUuid
}
