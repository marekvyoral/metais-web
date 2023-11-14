import { ApiCodelistManager, ApiCodelistName, ApiCodelistPreview } from '@isdd/metais-common/api/generated/codelist-repo-swagger'
import { formatDateForDefaultValue } from '@isdd/metais-common/index'

import { IFieldTextRow } from '@/components/views/codeLists/CodeListEditView'

export const DEFAULT_EMPTY_NOTE: IFieldTextRow[] = [{ id: 0, text: '' }]

export interface IEditCodeListForm {
    base?: boolean
    code: string
    codeListName?: ApiCodelistName
    newCodeListName?: ApiCodelistName
    codeListNotes?: IFieldTextRow[]
    codeListSource?: IFieldTextRow[]
    mainGestor?: ApiCodelistManager[]
    newMainGestor?: ApiCodelistManager
    nextGestor?: ApiCodelistManager[]
    refIndicator?: string
    effectiveFrom?: string
    effectiveTo?: string
    fromDate?: string
    toDate?: string
    name: string
    lastName: string
    email: string
    phone: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any
}

export const mapCodeListToEditForm = (code: ApiCodelistPreview | undefined, language: string): IEditCodeListForm | undefined => {
    if (!code) return undefined
    return {
        base: code.base || false,
        code: code.code ?? '',
        codeListName: code.codelistNames
            ?.filter((item) => item.language === language)
            .map((name) => ({
                ...name,
                effectiveFrom: name.effectiveFrom ? formatDateForDefaultValue(name.effectiveFrom) : '',
                effectiveTo: name.effectiveTo ? formatDateForDefaultValue(name.effectiveTo) : '',
            }))
            ?.at(0),
        codeListNotes:
            code?.codelistNotes?.length === 0
                ? DEFAULT_EMPTY_NOTE
                : code.codelistNotes?.map((note) => ({
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
        fromDate: code.fromDate ? formatDateForDefaultValue(code.fromDate) : '',
        toDate: code.toDate ? formatDateForDefaultValue(code.toDate) : '',
        name: code.contactFirstName ?? '',
        lastName: code.contactSurname ?? '',
        phone: code.contactPhone ?? '',
        email: code.contactMail ?? '',
    }
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
        codelistNames: [
            {
                ...formData.codeListName,
                effectiveFrom: formData.codeListName?.effectiveFrom ? new Date(formData.codeListName.effectiveFrom).toISOString() : '',
                effectiveTo: formData.codeListName?.effectiveTo ? new Date(formData.codeListName.effectiveTo).toISOString() : '',
            },
            ...(formData.newCodeListName?.value
                ? [
                      {
                          ...formData.newCodeListName,
                          effectiveFrom: formData.newCodeListName?.effectiveFrom
                              ? new Date(formData.newCodeListName.effectiveFrom).toISOString()
                              : '',
                          effectiveTo: formData.newCodeListName?.effectiveTo ? new Date(formData.newCodeListName.effectiveTo).toISOString() : '',
                      },
                  ]
                : []),
        ],
        codelistNotes: formData.codeListNotes?.map((note) => ({ id: note.id, value: note.text, language })),
        codelistSource: formData.codeListSource?.map((source) => source.text),
        uri: formData.refIndicator,
        effectiveFrom: formData.effectiveFrom ? new Date(formData.effectiveFrom).toISOString() : '',
        effectiveTo: formData.effectiveTo ? new Date(formData.effectiveTo).toISOString() : '',
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        contactFirstName: formData.name,
        contactSurname: formData.lastName,
        contactPhone: formData.phone,
        contactMail: formData.email,
    }
}
