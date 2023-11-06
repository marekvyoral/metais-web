import { DateTime } from 'luxon'

import { ConfigurationItemUiAttributes } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { Attribute, AttributeAttributeTypeEnum } from '@isdd/metais-common/api/generated/types-repo-swagger'

export const formatDateForDefaultValue = (date: string, format = 'yyyy-MM-dd') => {
    return DateTime.fromJSDate(new Date(date)).toFormat(format)
}

export const formatDateTimeForDefaultValue = (date: string, format = 'yyyy-MM-dd HH:mm') => {
    return DateTime.fromJSDate(new Date(date)).toFormat(format)
}

export const formatDateForFormDefaultValues = (
    defaultItemAttributeValues: ConfigurationItemUiAttributes,
    attributes: (Attribute | undefined)[],
): ConfigurationItemUiAttributes => {
    const formattedDefaultAttributeValues: ConfigurationItemUiAttributes = {}

    for (const key in defaultItemAttributeValues) {
        const matchedAttributeType = attributes.find((att) => att?.technicalName == key)?.attributeTypeEnum
        if (matchedAttributeType === AttributeAttributeTypeEnum.DATE) {
            formattedDefaultAttributeValues[key] = formatDateForDefaultValue(defaultItemAttributeValues[key])
        } else {
            formattedDefaultAttributeValues[key] = defaultItemAttributeValues[key]
        }
    }

    return formattedDefaultAttributeValues
}
