import { ATTRIBUTE_NAME } from '@isdd/metais-common/api/constants'
import { ConfigurationItemUiAttributes } from '@isdd/metais-common/api/generated/cmdb-swagger'

export const createFullAdressFromAttributes = (attributes: ConfigurationItemUiAttributes | undefined) => {
    return `${attributes?.[ATTRIBUTE_NAME.EA_Profil_PO_ulica] ?? ''} 
    ${attributes?.[ATTRIBUTE_NAME.EA_Profil_PO_cislo] ?? ''} 
    ${attributes?.[ATTRIBUTE_NAME.EA_Profil_PO_psc] ?? ''} 
    ${attributes?.[ATTRIBUTE_NAME.EA_Profil_PO_obec] ?? ''} 
    `
}
