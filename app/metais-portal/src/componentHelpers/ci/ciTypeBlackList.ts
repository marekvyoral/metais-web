import { ATTRIBUTE_NAME, ATTRIBUTE_PROFILE_NAME } from '@isdd/metais-common/api'
import { CiType } from '@isdd/metais-common/api/generated/types-repo-swagger'

export type BlackListType = {
    attributes: string[]
    attributeProfiles: {
        technicalName: string
        attributes?: string[]
    }[]
}

export const CI_TYPE_DATA_ITVS_EXCEPTIONS_BLACK_LIST: BlackListType = {
    attributes: [
        ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov,
        ATTRIBUTE_NAME.Gen_Profil_popis,
        ATTRIBUTE_NAME.Gen_Profil_anglicky_popis,
        ATTRIBUTE_NAME.Gen_Profil_poznamka,
    ],
    attributeProfiles: [],
}

export const CI_TYPE_DATA_TRAINING_BLACK_LIST: BlackListType = {
    attributes: [
        ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov,
        ATTRIBUTE_NAME.Gen_Profil_anglicky_popis,
        ATTRIBUTE_NAME.Gen_Profil_poznamka,
        ATTRIBUTE_NAME.Gen_Profil_zdroj,
        ATTRIBUTE_NAME.Gen_Profil_ref_id,
    ],
    attributeProfiles: [{ technicalName: ATTRIBUTE_PROFILE_NAME.Gen_Profil_EA }],
}

export const getModifiedCiTypeData = (ciTypeData: CiType | undefined, blackList: BlackListType): CiType => {
    const filteredAttributes = ciTypeData?.attributes?.filter((attribute) => !blackList.attributes.includes(attribute?.technicalName ?? ''))
    const filteredProfileAttributes = ciTypeData?.attributeProfiles
        ?.filter((item) => !blackList.attributeProfiles.find((profile) => profile.technicalName === item.technicalName))
        .map((item) => {
            const blackListAttributes = blackList.attributeProfiles.find((profile) => profile.technicalName === item.technicalName)?.attributes
            if (!blackListAttributes || blackListAttributes.length === 0) {
                return item
            }
            const attributes = item.attributes?.filter((attribute) => blackListAttributes?.includes(attribute.technicalName ?? ''))
            return { ...item, attributes }
        })

    return { ...ciTypeData, attributes: filteredAttributes, attributeProfiles: filteredProfileAttributes }
}
