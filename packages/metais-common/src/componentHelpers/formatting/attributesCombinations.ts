import { ATTRIBUTE_NAME, ConfigurationItemUiAttributes } from '@isdd/metais-common/api'

export const createFullAdressFromAttributes = (attributes: ConfigurationItemUiAttributes | undefined) => {
    return `${attributes?.[ATTRIBUTE_NAME.EA_Profil_PO_ulica] ?? ''} 
    ${attributes?.[ATTRIBUTE_NAME.EA_Profil_PO_cislo] ?? ''} 
    ${attributes?.[ATTRIBUTE_NAME.EA_Profil_PO_psc] ?? ''} 
    ${attributes?.[ATTRIBUTE_NAME.EA_Profil_PO_obec] ?? ''} 
    `
}
