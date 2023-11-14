import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { Languages } from '@isdd/metais-common/localization/languages'

const ENGLISH_ATTRIBUTES: string[] = [ATTRIBUTE_NAME.Gen_Profil_anglicky_nazov, ATTRIBUTE_NAME.Gen_Profil_anglicky_popis]

export const setEnglishLangForAttr = (attr: string): Languages | undefined => {
    if (ENGLISH_ATTRIBUTES.includes(attr)) return Languages.ENGLISH
    return undefined
}
