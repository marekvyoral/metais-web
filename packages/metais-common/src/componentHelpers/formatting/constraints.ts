import { Attribute, AttributeProfile, AttributeConstraintEnum } from '@isdd/metais-common/api'

export const calculateConstraintFromAttributes = (entityAttributes: Attribute[] | undefined) => {
    return (
        entityAttributes
            ?.map((attribute: Attribute) =>
                attribute?.constraints?.filter((item) => item.type === 'enum').map((constraint: AttributeConstraintEnum) => constraint?.enumCode),
            )
            .flat() ?? []
    )
}

export const calculateConstraintFromAttributeProfiles = (entityAttributeProfiles: AttributeProfile[] | undefined) => {
    return (
        entityAttributeProfiles
            ?.map((profile: AttributeProfile) =>
                profile?.attributes?.map((attribute) =>
                    attribute?.constraints?.filter((item) => item.type === 'enum').map((constraint: AttributeConstraintEnum) => constraint?.enumCode),
                ),
            )
            .flat(2) ?? []
    )
}
