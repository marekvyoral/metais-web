import { MetaInformationTypes } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { EnumType } from '@isdd/metais-common/api'
import { AttributeAttributeTypeEnum } from '@isdd/metais-common/api/generated/types-repo-swagger'
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
    const onlyFulltext = [OPERATOR_OPTIONS_URL.FULLTEXT].filter((item) => !currentAvailableOperators?.includes(item))
    const allButFulltext = operators
        .filter((item) => item !== OPERATOR_OPTIONS_URL.FULLTEXT)
        .filter((item) => !currentAvailableOperators?.includes(item))
    const onlyGreaterOrLower = [OPERATOR_OPTIONS_URL.LOWER, OPERATOR_OPTIONS_URL.GREATER].filter((item) => !currentAvailableOperators?.includes(item))
    const onlyEqual = [OPERATOR_OPTIONS_URL.EQUAL].filter((item) => !currentAvailableOperators?.includes(item))
    const onlyFulltextOrEqual = [OPERATOR_OPTIONS_URL.EQUAL, OPERATOR_OPTIONS_URL.FULLTEXT].filter(
        (item) => !currentAvailableOperators?.includes(item),
    )
    const all = operators.filter((item) => !currentAvailableOperators?.includes(item))

    if (attType.isArray && !hasEnumItems) {
        return onlyFulltextOrEqual
    }

    if (hasEnumItems) {
        return onlyEqual
    }

    switch (attType.type) {
        case AttributeAttributeTypeEnum.DATE: {
            return onlyGreaterOrLower
        }
        case MetaInformationTypes.LAST_MODIFIED: {
            return onlyGreaterOrLower
        }
        case MetaInformationTypes.CREATED_AT: {
            return onlyGreaterOrLower
        }
        case MetaInformationTypes.STATE: {
            return onlyFulltext
        }
        case MetaInformationTypes.OWNER: {
            return onlyFulltext
        }
        case AttributeAttributeTypeEnum.INTEGER: {
            return allButFulltext
        }
        case AttributeAttributeTypeEnum.BYTE: {
            return allButFulltext
        }
        case AttributeAttributeTypeEnum.DOUBLE: {
            return allButFulltext
        }
        case AttributeAttributeTypeEnum.FLOAT: {
            return allButFulltext
        }
        case AttributeAttributeTypeEnum.LONG: {
            return allButFulltext
        }
        case AttributeAttributeTypeEnum.SHORT: {
            return allButFulltext
        }
        case AttributeAttributeTypeEnum.BOOLEAN: {
            return onlyEqual
        }
        case AttributeAttributeTypeEnum.STRING: {
            return onlyFulltextOrEqual
        }
        default: {
            return all
        }
    }
}
