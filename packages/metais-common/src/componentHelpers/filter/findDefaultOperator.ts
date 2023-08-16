import { AttributeAttributeTypeEnum, EnumType } from '@isdd/metais-common/api'
import { OPERATOR_OPTIONS_URL } from '@isdd/metais-common/hooks/useFilter'

export const findDefaultOperator = (attType: { isArray: boolean; type: string }, attributeConstraints: EnumType | undefined) => {
    const hasEnumItems = !!attributeConstraints?.code && attributeConstraints.enumItems && attributeConstraints.enumItems.length > 0

    if (attType.isArray && !hasEnumItems) {
        return OPERATOR_OPTIONS_URL.FULLTEXT
    }

    if (hasEnumItems) {
        return OPERATOR_OPTIONS_URL.EQUAL
    }

    switch (attType.type) {
        case AttributeAttributeTypeEnum.STRING: {
            return OPERATOR_OPTIONS_URL.FULLTEXT
        }
        case AttributeAttributeTypeEnum.BOOLEAN: {
            return OPERATOR_OPTIONS_URL.EQUAL
        }
        case AttributeAttributeTypeEnum.INTEGER ||
            AttributeAttributeTypeEnum.BYTE ||
            AttributeAttributeTypeEnum.DOUBLE ||
            AttributeAttributeTypeEnum.FLOAT ||
            AttributeAttributeTypeEnum.LONG ||
            AttributeAttributeTypeEnum.SHORT: {
            return OPERATOR_OPTIONS_URL.EQUAL
        }
        case AttributeAttributeTypeEnum.DATE: {
            return OPERATOR_OPTIONS_URL.EQUAL
        }
        default: {
            return ''
        }
    }
}
