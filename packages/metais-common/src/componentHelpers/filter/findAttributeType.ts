import { ReactNode } from 'react'

import { Attribute, AttributeAttributeTypeEnum, AttributeConstraintsItem } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { ExtendedAttribute, FilterAttribute } from '@isdd/metais-common/components/dynamicFilterAttributes/DynamicFilterAttributes'

export type CustomAttributeType = {
    isArray?: boolean
    type?: AttributeAttributeTypeEnum | string
    cmdbConstraints?: AttributeConstraintsItem
    customComponent?: (
        value: FilterAttribute,
        onChange: (data: FilterAttribute, prevData?: FilterAttribute, isNewName?: boolean) => void,
    ) => ReactNode
    customOperators?: string[]
}

export const findAttributeType = (name: string, attributes: (ExtendedAttribute | Attribute | undefined)[]): CustomAttributeType => {
    const foundAttribute = attributes?.find((att) => att?.technicalName === name)
    const isCMDB = foundAttribute?.constraints?.at(0)?.type === 'ciType'

    return {
        isArray: foundAttribute?.array ?? false,
        type: foundAttribute?.attributeTypeEnum ?? '',
        cmdbConstraints: isCMDB ? foundAttribute?.constraints?.at(0) : undefined,
        customComponent:
            foundAttribute && 'customComponent' in foundAttribute && !!foundAttribute.customComponent ? foundAttribute.customComponent : undefined,
        customOperators:
            foundAttribute && 'customOperators' in foundAttribute && foundAttribute.customOperators ? foundAttribute.customOperators : [],
    }
}
