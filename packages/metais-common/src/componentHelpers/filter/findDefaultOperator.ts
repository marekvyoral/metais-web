import { CustomAttributeType } from './findAttributeType'

import { MetaInformationTypes } from '@isdd/metais-common/componentHelpers/ci/getCiDefaultMetaAttributes'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { AttributeAttributeTypeEnum } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { OPERATOR_OPTIONS_URL } from '@isdd/metais-common/hooks/useFilter'

export const findDefaultOperator = (attType: CustomAttributeType, attributeConstraints: EnumType | undefined) => {
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
        case AttributeAttributeTypeEnum.INTEGER: {
            return OPERATOR_OPTIONS_URL.EQUAL
        }
        case AttributeAttributeTypeEnum.BYTE: {
            return OPERATOR_OPTIONS_URL.EQUAL
        }
        case AttributeAttributeTypeEnum.DOUBLE: {
            return OPERATOR_OPTIONS_URL.EQUAL
        }
        case AttributeAttributeTypeEnum.FLOAT: {
            return OPERATOR_OPTIONS_URL.EQUAL
        }
        case AttributeAttributeTypeEnum.LONG: {
            return OPERATOR_OPTIONS_URL.EQUAL
        }
        case AttributeAttributeTypeEnum.SHORT: {
            return OPERATOR_OPTIONS_URL.EQUAL
        }
        case MetaInformationTypes.STATE: {
            return OPERATOR_OPTIONS_URL.FULLTEXT
        }
        case MetaInformationTypes.OWNER: {
            return OPERATOR_OPTIONS_URL.FULLTEXT
        }
        case MetaInformationTypes.LAST_MODIFIED: {
            return OPERATOR_OPTIONS_URL.GREATER
        }
        case MetaInformationTypes.CREATED_AT: {
            return OPERATOR_OPTIONS_URL.GREATER
        }
        case AttributeAttributeTypeEnum.DATE: {
            return OPERATOR_OPTIONS_URL.GREATER
        }
        default: {
            return ''
        }
    }
}
