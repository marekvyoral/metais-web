import { Attribute, AttributeAttributeTypeEnum, AttributeConstraintsItem } from '@isdd/metais-common/api/generated/types-repo-swagger'

export type CustomAttributeType = {
    isArray?: boolean
    type?: AttributeAttributeTypeEnum | string
    cmdbConstraints?: AttributeConstraintsItem
}

export const findAttributeType = (name: string, attributes: (Attribute | undefined)[]): CustomAttributeType => {
    const foundAttribute = attributes?.find((att) => att?.technicalName === name)
    const isCMDB = foundAttribute?.constraints?.at(0)?.type === 'ciType'

    return {
        isArray: foundAttribute?.array ?? false,
        type: foundAttribute?.attributeTypeEnum ?? '',
        cmdbConstraints: isCMDB ? foundAttribute?.constraints?.at(0) : undefined,
    }
}
