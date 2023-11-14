import { Attribute, AttributeConstraintEnumAllOf, AttributeProfile } from '@isdd/metais-common/api/generated/types-repo-swagger'

export const calculateConstraintFromAttributes = (entityAttributes: Attribute[] | undefined) => {
    return (
        entityAttributes
            ?.map((attribute: Attribute) =>
                attribute?.constraints
                    ?.filter((item) => item.type === 'enum')
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    .map((constraint: AttributeConstraintEnumAllOf) => constraint?.enumCode),
            )
            .flat() ?? []
    )
}

export const calculateConstraintFromAttributeProfiles = (entityAttributeProfiles: AttributeProfile[] | undefined) => {
    return (
        entityAttributeProfiles
            ?.map((profile: AttributeProfile) =>
                profile?.attributes?.map((attribute) =>
                    attribute?.constraints
                        ?.filter((item) => item.type === 'enum')
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //@ts-ignore
                        .map((constraint: AttributeConstraintEnumAllOf) => constraint?.enumCode),
                ),
            )
            .flat(2) ?? []
    )
}
