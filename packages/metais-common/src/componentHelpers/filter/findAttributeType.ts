import { Attribute } from '@isdd/metais-common/api/generated/types-repo-swagger'

export const findAttributeType = (name: string, attributes: (Attribute | undefined)[]) => {
    const foundAttribute = attributes?.find((att) => att?.technicalName === name)
    return {
        isArray: foundAttribute?.array ?? false,
        type: foundAttribute?.attributeTypeEnum ?? '',
    }
}
