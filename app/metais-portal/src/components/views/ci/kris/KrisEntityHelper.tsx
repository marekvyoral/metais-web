import { ConfigurationItemUi, HistoryVersionsListUiConfigurationItemUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { ConfigurationItemUiAttributes, GraphRequestUi } from '@isdd/metais-common/api/generated/kris-swagger'
import { IApproveFormData } from '@isdd/metais-common/api/userConfigKvKrit'

import { IReturnToWorkoutFormData } from './Modals/ReturnToWorkoutModal'

export const AKVS_ICO = '000000003001'
export const FILTER_PARAM = {
    filter: {
        type: ['PO'],
        attributes: [
            {
                name: 'EA_Profil_PO_ico',
                filterValue: [{ value: AKVS_ICO, equality: 'EQUAL' }],
            },
        ],
    },
    page: 1,
    perpage: 1,
}

export const createNewKrisAttributes = (ciData?: ConfigurationItemUi): ConfigurationItemUiAttributes[] => {
    const attributes: ConfigurationItemUiAttributes[] = []
    let datumSchvaleniaSet = false

    const names = Object.keys(ciData?.attributes ?? {})
    const values = Object.values(ciData?.attributes ?? {})

    names.forEach((name, index) => {
        if (name === 'Profil_KRIS_datum_schvalenia') {
            datumSchvaleniaSet = true
        } else if (name === 'Profil_KRIS_stav_kris') {
            attributes.push({
                name: 'Profil_KRIS_stav_kris',
                value: 'c_stav_kris.5',
            })
        } else {
            attributes.push({
                name: name,
                value: values[index],
            })
        }
    })
    if (!datumSchvaleniaSet) {
        attributes.push({
            name: 'Profil_KRIS_datum_schvalenia',
            value: new Date(),
        })
    }

    return attributes
}

const createNewKrisAttributesReturn = (ciData?: ConfigurationItemUi): ConfigurationItemUiAttributes[] => {
    const attributes: ConfigurationItemUiAttributes[] = []
    const names = Object.keys(ciData?.attributes ?? {})
    const values = Object.values(ciData?.attributes ?? {})

    names.forEach((name, index) => {
        if (name === 'Profil_KRIS_stav_kris') {
            attributes.push({
                name: 'Profil_KRIS_stav_kris',
                value: 'c_stav_kris.4',
            })
        } else {
            attributes.push({
                name: name,
                value: values[index],
            })
        }
    })
    return attributes
}

export const getBaseGraphApprove = (
    createdGroupGid: string,
    originalOwner: string,
    protocolFormModel: IApproveFormData,
    protocolUuid: string,
    relationUuid: string,
    ciData?: ConfigurationItemUi,
): GraphRequestUi => {
    const storeGraphRequest = {
        storeSet: {
            configurationItemSet: [
                {
                    type: 'KRIS_Protokol',
                    uuid: protocolUuid,
                    owner: createdGroupGid,
                    attributes: [
                        {
                            name: 'Gen_Profil_zdroj',
                            value: 'c_zdroj.1',
                        },
                        {
                            name: 'Gen_Profil_kod_metais',
                            value: protocolFormModel.Gen_Profil_kod_metais,
                        },
                        {
                            name: 'Gen_Profil_ref_id',
                            value: protocolFormModel.Gen_Profil_ref_id,
                        },
                        {
                            name: 'Gen_Profil_nazov',
                            value: protocolFormModel.Gen_Profil_kod_metais,
                        },
                        {
                            name: 'Gen_Profil_popis',
                            value: protocolFormModel.description,
                        },
                        {
                            name: 'Profil_KRIS_Protokol_hodnotenie_spravnosti',
                            value: protocolFormModel.hodnotenie_spravnosti,
                        },
                        {
                            name: 'Profil_KRIS_Protokol_hodnotenie_uplnosti',
                            value: protocolFormModel.hodnotenie_uplnosti,
                        },
                        {
                            name: 'Profil_KRIS_Protokol_overil_datum',
                            value: protocolFormModel.overil_datum && new Date(protocolFormModel.overil_datum).toISOString(),
                        },
                        {
                            name: 'Profil_KRIS_Protokol_overil_funkcia',
                            value: protocolFormModel.overil_funkcia,
                        },
                        {
                            name: 'Profil_KRIS_Protokol_overil_meno',
                            value: protocolFormModel.overil_meno,
                        },
                        {
                            name: 'Profil_KRIS_Protokol_schvalil_datum',
                            value: protocolFormModel.schvalil_datum && new Date(protocolFormModel.schvalil_datum).toISOString(),
                        },
                        {
                            name: 'Profil_KRIS_Protokol_schvalil_funkcia',
                            value: protocolFormModel.schvalil_funkcia,
                        },
                        {
                            name: 'Profil_KRIS_Protokol_schvalil_meno',
                            value: protocolFormModel.schvalil_meno,
                        },
                        {
                            name: 'Profil_KRIS_Protokol_vyhotovil_datum',
                            value: protocolFormModel.vyhotovil_datum && new Date(protocolFormModel.vyhotovil_datum).toISOString(),
                        },
                        {
                            name: 'Profil_KRIS_Protokol_vyhotovil_funkcia',
                            value: protocolFormModel.vyhotovil_funkcia,
                        },
                        {
                            name: 'Profil_KRIS_Protokol_vyhotovil_meno',
                            value: protocolFormModel.vyhotovil_meno,
                        },
                    ],
                },
                {
                    type: ciData?.type,
                    uuid: ciData?.uuid,
                    owner: originalOwner,
                    attributes: createNewKrisAttributes(ciData),
                },
            ],
            relationshipSet: [
                {
                    type: 'KRIS_protokol_sa_tyka_KRIS',
                    uuid: relationUuid,
                    startUuid: protocolUuid,
                    endUuid: ciData?.uuid,
                    owner: createdGroupGid,
                    attributes: [],
                },
            ],
        },
        invalidateSet: {},
    }
    return storeGraphRequest as GraphRequestUi
}

export const getBaseGraphReturnToWorkout = (
    createdGroupGid: string,
    originalOwner: string,
    protocolFormModel: IReturnToWorkoutFormData,
    protocolUuid: string,
    relationUuid: string,
    ciData?: ConfigurationItemUi,
): GraphRequestUi => {
    const storeGraphRequest = {
        storeSet: {
            configurationItemSet: [
                {
                    type: 'KRIS_Protokol',
                    uuid: protocolUuid,
                    owner: createdGroupGid,
                    attributes: [
                        {
                            name: 'Gen_Profil_zdroj',
                            value: 'c_zdroj.1',
                        },
                        {
                            name: 'Gen_Profil_kod_metais',
                            value: protocolFormModel.Gen_Profil_kod_metais,
                        },
                        {
                            name: 'Gen_Profil_ref_id',
                            value: protocolFormModel.Gen_Profil_ref_id,
                        },
                        {
                            name: 'Gen_Profil_nazov',
                            value: protocolFormModel.Gen_Profil_kod_metais,
                        },
                        {
                            name: 'Gen_Profil_popis',
                            value: protocolFormModel.note,
                        },
                    ],
                },
                {
                    type: ciData?.type,
                    uuid: ciData?.uuid,
                    attributes: createNewKrisAttributesReturn(ciData),
                },
            ],
            relationshipSet: [
                {
                    type: 'KRIS_protokol_sa_tyka_KRIS',
                    uuid: relationUuid,
                    startUuid: protocolUuid,
                    endUuid: ciData?.uuid,
                    owner: createdGroupGid,
                    attributes: [],
                },
            ],
        },
        invalidateSet: {},
        changeOwnerSet: {
            configurationItemSet: [
                {
                    type: ciData?.type,
                    uuid: ciData?.uuid,
                    attributes: createNewKrisAttributesReturn(ciData),
                },
            ],
            relationshipSet: [],
            changeOwnerData: {
                newOwner: originalOwner,
                changeReason: 'Vrátenie na dopracovanie KRIS',
                changeDescription: 'Vrátenie na dopracovanie KRIS',
                changeType: 'changeCmdbItem',
            },
        },
        customMessage: {
            messageSuccessType: 'KRIS_SUCCESS',
            successPlaceholderValues: [ciData?.attributes?.['Gen_Profil_nazov'], protocolFormModel.note],
        },
    }

    return storeGraphRequest as GraphRequestUi
}

export const getBaseGraphSendToApproving = (createdGroupGid: string, ciData?: ConfigurationItemUi): GraphRequestUi => {
    const attributes: ConfigurationItemUiAttributes[] = []
    let datumVypracovaniaSet = false

    const names = Object.keys(ciData?.attributes ?? {})
    const values = Object.values(ciData?.attributes ?? {})

    names.forEach((name, index) => {
        if (name === 'Profil_KRIS_datum_vypracovania') {
            datumVypracovaniaSet = true
        } else if (name === 'Profil_KRIS_stav_kris') {
            attributes.push({
                name: 'Profil_KRIS_stav_kris',
                value: 'c_stav_kris.3',
            })
        } else {
            attributes.push({
                name: name,
                value: values[index],
            })
        }
    })
    if (!datumVypracovaniaSet) {
        attributes.push({
            name: 'Profil_KRIS_datum_vypracovania',
            value: new Date(),
        })
    }

    const storeGraphRequest = {
        storeSet: {
            configurationItemSet: [
                {
                    ...ciData,
                    attributes: attributes,
                },
            ],
            relationshipSet: [],
        },
        invalidateSet: {},
        changeOwnerSet: {
            relationshipSet: [],
            configurationItemSet: [
                {
                    ...ciData,
                    attributes: attributes,
                },
            ],
            changeOwnerData: {
                newOwner: createdGroupGid,
                changeReason: 'architectureChange',
                changeDescription: 'Zaslanie na schválenie',
                changeType: 'changeCmdbItem',
            },
        },
    }

    return storeGraphRequest as GraphRequestUi
}

export const getOriginalOwner = (historyRes: HistoryVersionsListUiConfigurationItemUi, entityData?: ConfigurationItemUi): string => {
    let originalOwner = ''
    historyRes.historyVersions?.forEach((history) => {
        if (history.item?.metaAttributes?.owner != entityData?.metaAttributes?.owner) {
            originalOwner = history.item?.metaAttributes?.owner ?? ''
        }
    })

    if (!originalOwner) {
        originalOwner = entityData?.metaAttributes?.owner ?? ''
    }

    return originalOwner
}
