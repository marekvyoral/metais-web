import { ButtonLink } from '@isdd/idsk-ui-kit'
import {
    ApiReferenceRegister,
    ApiReferenceRegisterMuk,
    ApiReferenceRegisterState,
} from '@isdd/metais-common/api/generated/reference-registers-swagger'
import { TFunction } from 'i18next'
import { StateValue } from 'xstate'
import { BASE_PAGE_SIZE } from '@isdd/metais-common/api/constants'
import { CiListFilterContainerUi, ConfigurationItemSetUi, NeighbourPairUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { mapReportsCiItemToOptions } from '@isdd/metais-common/componentHelpers/filter'
import { IOptions } from '@isdd/metais-common/components/select-cmdb-params/SelectFilterCMDBParamsOptions'
import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

import { IRefRegisterCreateFormData } from '@/components/views/refRegisters/schema'

export const getPopupContent = (
    allPosibleOptions: ApiReferenceRegisterState[],
    t: TFunction<'translation', undefined, 'translation'>,
    onClick: (option: ApiReferenceRegisterState) => void,
) => {
    return allPosibleOptions?.map((option) => {
        const translatePrefix =
            option === ApiReferenceRegisterState.IN_CONSTRUCTION ? 'refRegisters.header.inConstructionPrefix' : 'refRegisters.header.othersPrefix'
        return (
            <ButtonLink
                key={option.toString()}
                label={t(translatePrefix, { itemName: t(`refRegisters.table.state.${option}`) })}
                onClick={() => onClick(option)}
                withoutFocus
            />
        )
    })
}

export const showChangeDataOfManager = (state: StateValue) => {
    return (
        state === ApiReferenceRegisterState.PUBLISHED ||
        state === ApiReferenceRegisterState.READY_TO_APPROVAL ||
        state === ApiReferenceRegisterState.APPROVAL_IN_PROGRESS
    )
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

export const mapFormDataToApiReferenceRegister = (formData: IRefRegisterCreateFormData, entityId?: string): ApiReferenceRegister => {
    return {
        contact: formData.refRegisters.manager.email, //toZoliDo this should be 2 separate fields
        contactRegistrator: formData.refRegisters.registrar.email, //toZoliDo this should be 2 separate fields
        managerName: formData.refRegisters.manager.firstName, // toZoliDo this should be 2 separate fields?
        registratorName: formData.refRegisters.manager.firstName, // toZoliDo this should be 2 separate fields?
        isvsUuid: formData.refRegisters.sourceRegister,
        creatorUuid: formData.refRegisters.creator,
        managerUuid: formData.refRegisters.manager.PO,
        registratorUuid: formData.refRegisters.registrar.PO,
        isvsName: formData.refRegisters.name,
        effectiveFrom: formData.refRegisters.effectiveFrom ? new Date(formData.refRegisters.effectiveFrom).toISOString() : ' ',
        effectiveTo: formData.refRegisters.effectiveTo ? new Date(formData.refRegisters.effectiveTo).toISOString() : '',
        state: ApiReferenceRegisterState.IN_CONSTRUCTION,
        muk: ApiReferenceRegisterMuk.NONE,
        additionalData: formData.refRegisters.additionalData,

        uuid: entityId ?? undefined,
    }
}

export const mapDefaultDataToFormDataRR = (defaultData?: ApiReferenceRegister): IRefRegisterCreateFormData => {
    return {
        refRegisters: {
            codeMetaIS: defaultData?.isvsCode,
            creator: defaultData?.creatorUuid,
            sourceRegister: defaultData?.isvsUuid,
            name: defaultData?.isvsName, //tozoliDO probably this changes too with BE changes
            refId: defaultData?.isvsRefId,
            effectiveFrom: getDefaultDateRR(defaultData?.effectiveFrom),
            effectiveTo: getDefaultDateRR(defaultData?.effectiveTo),
            state: defaultData?.state,
            manager: {
                PO: defaultData?.managerUuid,
                email: defaultData?.contact, //tozoliDO probably this changes too with BE changes
                firstName: defaultData?.contact,
                lastName: defaultData?.contact,
                phoneNumber: defaultData?.contact,
            },
            registrar: {
                PO: defaultData?.registratorUuid,
                email: defaultData?.contactRegistrator, //tozoliDO probably this changes too with BE changes
                firstName: defaultData?.contactRegistrator,
                lastName: defaultData?.contactRegistrator,
                phoneNumber: defaultData?.contactRegistrator,
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
        page === 1 ? [...(POData?.configurationItemSet ?? []), ...(data.configurationItemSet ?? [])] : data.configurationItemSet

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
