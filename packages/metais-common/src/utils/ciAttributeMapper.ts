import { ConfigurationItemSetUi, ConfigurationItemUiAttributes } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { AttributeUi, ConfigurationItemSetUi as ConfigurationItemSetUiDefault } from '@isdd/metais-common/api/generated/iam-swagger'

export const ciItemArrayToObject = (ciItem?: ConfigurationItemSetUiDefault): ConfigurationItemSetUi => {
    const configurationItemSet = ciItem?.configurationItemSet?.map((item) => {
        const attributes: ConfigurationItemUiAttributes = {}
        item?.attributes?.forEach((attribute) => {
            const attributeName = attribute.name ?? ''
            attributes[attributeName] = attribute.value
        })
        return { ...item, attributes }
    })

    return { ...ciItem, configurationItemSet }
}
