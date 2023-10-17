import { Attribute, AttributeConstraintEnum } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { EnumType } from '@isdd/metais-common/api'

export const findAttributeConstraints = (technicalName: string, attributes: (Attribute | undefined)[], constraintsData: (EnumType | undefined)[]) => {
    const constraints = attributes.find((item) => item?.technicalName === technicalName)?.constraints as AttributeConstraintEnum[]
    const attributeConstraints = constraintsData.find((item) => item?.code === constraints?.at(0)?.enumCode)
    return attributeConstraints
}
