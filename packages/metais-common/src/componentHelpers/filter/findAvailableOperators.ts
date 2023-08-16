import { AttributeAttributeTypeEnum, EnumType } from '@isdd/metais-common/api'
import { OPERATOR_OPTIONS_URL } from '@isdd/metais-common/hooks/useFilter'

export const findAvailableOperators = (
    attType: {
        isArray: boolean
        type: string
    },
    attributeConstraints: EnumType | undefined,
    operators: string[],
    currentAvailableOperators?: (string | undefined)[],
) => {
    const hasEnumItems = !!attributeConstraints?.code && attributeConstraints.enumItems && attributeConstraints.enumItems.length > 0

    if (attType.isArray && !hasEnumItems) {
        return [OPERATOR_OPTIONS_URL.EQUAL, OPERATOR_OPTIONS_URL.FULLTEXT].filter((item) => !currentAvailableOperators?.includes(item))
    }

    if (hasEnumItems) {
        return [OPERATOR_OPTIONS_URL.EQUAL].filter((item) => !currentAvailableOperators?.includes(item))
    }

    switch (attType.type) {
        case AttributeAttributeTypeEnum.INTEGER ||
            AttributeAttributeTypeEnum.BYTE ||
            AttributeAttributeTypeEnum.DOUBLE ||
            AttributeAttributeTypeEnum.FLOAT ||
            AttributeAttributeTypeEnum.LONG ||
            AttributeAttributeTypeEnum.SHORT: {
            return operators.filter((item) => item !== OPERATOR_OPTIONS_URL.FULLTEXT).filter((item) => !currentAvailableOperators?.includes(item))
        }
        case AttributeAttributeTypeEnum.BOOLEAN: {
            return [OPERATOR_OPTIONS_URL.EQUAL].filter((item) => !currentAvailableOperators?.includes(item))
        }
        case AttributeAttributeTypeEnum.STRING: {
            return [OPERATOR_OPTIONS_URL.FULLTEXT, OPERATOR_OPTIONS_URL.EQUAL].filter((item) => !currentAvailableOperators?.includes(item))
        }
        default: {
            return operators.filter((item) => !currentAvailableOperators?.includes(item))
        }
    }
}
