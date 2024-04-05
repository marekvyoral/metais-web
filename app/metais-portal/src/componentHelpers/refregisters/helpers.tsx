import { ButtonLink } from '@isdd/idsk-ui-kit'
import {
    ApiReferenceRegister,
    ApiReferenceRegisterMuk,
    ApiReferenceRegisterState,
} from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { TFunction } from 'i18next'
import { BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { CiListFilterContainerUi, ConfigurationItemSetUi, NeighbourPairUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { mapReportsCiItemToOptions } from '@isdd/metais-common/componentHelpers/filter'
import { IOptions } from '@isdd/metais-common/components/select-cmdb-params/SelectFilterCMDBParamsOptions'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { Actions } from '@isdd/metais-common/hooks/permissions/useUserAbility'
import { Can } from '@isdd/metais-common/hooks/permissions/useAbilityContext'

import { IRefRegisterCreateFormData } from '@/components/views/refregisters/schema'

export const getPopupContent = (
    allPosibleOptions: ApiReferenceRegisterState[],
    t: TFunction<'translation', undefined, 'translation'>,
    onClick: (option: ApiReferenceRegisterState) => void,
) => {
    return allPosibleOptions?.map((option) => {
        const translatePrefix =
            option === ApiReferenceRegisterState.IN_CONSTRUCTION ? 'refRegisters.header.inConstructionPrefix' : 'refRegisters.header.othersPrefix'
        return (
            <Can I={Actions.CHANGE_STATES} a={`refRegisters.${option}`} key={option.toString()}>
                <ButtonLink
                    label={t(translatePrefix, { itemName: t(`refRegisters.table.state.${option}`) })}
                    onClick={() => onClick(option)}
                    withoutFocus
                />
            </Can>
        )
    })
}

export const getDefaultDateRR = (date?: string) => {
    if (date) return date.substring(0, 10)
    return undefined
}

export const getLabelRR = (refRegisterAttribute: string, renamedAttributes?: Attribute[]) => {
    return renamedAttributes?.find((val) => val?.technicalName === refRegisterAttribute)?.name
}

export const getInfoRR = (refRegisterAttribute: string, renamedAttributes?: Attribute[]) => {
    return renamedAttributes?.find((val) => val?.technicalName === refRegisterAttribute)?.description
}

interface ImapFormDataToApiReferenceRegister {
    formData: IRefRegisterCreateFormData
    entityId?: string
    managerUuid?: string
}

export const mapFormDataToApiReferenceRegister = ({ formData, entityId, managerUuid }: ImapFormDataToApiReferenceRegister): ApiReferenceRegister => {
    return {
        uuid: entityId ?? undefined,
        creatorUuid: formData.refRegisters.creator,
        isvsUuid: formData.refRegisters.sourceRegister,
        name: formData.refRegisters.name,
        name_en: formData.refRegisters.name_en,
        isvsCode: formData.refRegisters.codeMetaIS,
        isvsRefId: formData.refRegisters.refId,
        effectiveFrom: formData.refRegisters.effectiveFrom ? new Date(formData.refRegisters.effectiveFrom).toISOString() : ' ',
        effectiveTo: formData.refRegisters.effectiveTo ? new Date(formData.refRegisters.effectiveTo).toISOString() : '',
        additionalData: formData.refRegisters.additionalData,
        state: ApiReferenceRegisterState.IN_CONSTRUCTION,
        muk: ApiReferenceRegisterMuk.NONE,
        managerUuid: formData.refRegisters.creator ?? managerUuid,
        contactFirstName: formData.refRegisters.manager.firstName,
        contactLastName: formData.refRegisters.manager.lastName,
        contactEmail: formData.refRegisters.manager.email,
        contactPhone: formData.refRegisters.manager.phoneNumber,
        registratorUuid: formData.refRegisters.registrar.PO,
        contactRegistratorFirstName: formData.refRegisters.registrar.firstName,
        contactRegistratorLastName: formData.refRegisters.registrar.lastName,
        contactRegistratorEmail: formData.refRegisters.registrar.email,
        contactRegistratorPhone: formData.refRegisters.registrar.phoneNumber,
    } as ApiReferenceRegister
}

export const mapDefaultDataToFormDataRR = (defaultData?: ApiReferenceRegister): IRefRegisterCreateFormData => {
    return {
        refRegisters: {
            codeMetaIS: defaultData?.isvsCode,
            creator: defaultData?.creatorUuid,
            sourceRegister: defaultData?.isvsUuid,
            name: defaultData?.name,
            name_en: defaultData?.name_en,
            refId: defaultData?.isvsRefId,
            effectiveFrom: getDefaultDateRR(defaultData?.effectiveFrom),
            effectiveTo: getDefaultDateRR(defaultData?.effectiveTo),
            state: defaultData?.state,
            manager: {
                PO: defaultData?.managerUuid,
                email: defaultData?.contactEmail,
                firstName: defaultData?.contactFirstName,
                lastName: defaultData?.contactLastName,
                phoneNumber: defaultData?.contactPhone,
            },
            registrar: {
                PO: defaultData?.registratorUuid,
                email: defaultData?.contactRegistratorEmail,
                firstName: defaultData?.contactRegistratorFirstName,
                lastName: defaultData?.contactRegistratorLastName,
                phoneNumber: defaultData?.contactRegistratorPhone,
            },
            additionalData: defaultData?.additionalData,
        },
    }
}

export const getUserGroupOptions = (userGroupData?: ConfigurationItemSetUi): IOptions[] | undefined => {
    return userGroupData?.configurationItemSet?.map((userGroup) => {
        return { label: userGroup.attributes?.Gen_Profil_nazov, value: userGroup.uuid ?? '' }
    })
}

export const getSourceRegisterOptions = (sourceRegisters?: NeighbourPairUi[]): IOptions[] | undefined => {
    return sourceRegisters?.map((sourceRegister) => {
        return {
            label: sourceRegister.configurationItem?.attributes?.Gen_Profil_nazov,
            value: sourceRegister.configurationItem?.uuid ?? '',
        }
    })
}

export const loadPOOptions = async (
    additional: { page: number } | undefined,
    readCiList1: (ciListFilterContainerUi: CiListFilterContainerUi) => Promise<ConfigurationItemSetUi>,
    POData?: ConfigurationItemSetUi,
    searchTerm?: string,
) => {
    const page = !additional?.page ? 1 : (additional?.page || 0) + 1

    const queryOptions = {
        filter: {
            type: ['PO'],
            attributes: [
                {
                    name: 'EA_Profil_PO_kategoria_osoby',
                    filterValue: [
                        {
                            value: 'c_kategoria_osoba.2',
                            equality: 'EQUAL',
                        },
                    ],
                },
            ],
            fullTextSearch: searchTerm,
            metaAttributes: {
                state: ['DRAFT'],
            },
        },
        page: page,
        perpage: BASE_PAGE_SIZE,
        sortBy: 'Gen_Profil_nazov',
        sortType: 'ASC',
    }

    const data = await readCiList1(queryOptions)
    const hasMore = page + 1 <= (data.pagination?.totalPages ?? 0)

    const configurationItemSet =
        page === 1 && !searchTerm ? [...(POData?.configurationItemSet ?? []), ...(data.configurationItemSet ?? [])] : data.configurationItemSet

    const options = mapReportsCiItemToOptions(configurationItemSet)
    return {
        options: options || [],
        hasMore: hasMore,
        additional: {
            page: page,
        },
    }
}

export const isRRFieldEditable = (state?: ApiReferenceRegisterState, contact = false, additionalData = false) => {
    switch (state) {
        case undefined:
        case ApiReferenceRegisterState.IN_CONSTRUCTION:
            return true
        case ApiReferenceRegisterState.PUBLISHED:
        case ApiReferenceRegisterState.READY_TO_APPROVAL:
        case ApiReferenceRegisterState.APPROVAL_IN_PROGRESS:
            return additionalData !== contact
        default:
            return contact
    }
}

export const showCreatorForm = (defaultUserGroup?: IOptions, defaultData?: ApiReferenceRegister) => !defaultUserGroup && !defaultData?.isvsUuid
export const showSourceRegisterForm = (defaultData?: ApiReferenceRegister) => !defaultData?.isvsUuid
