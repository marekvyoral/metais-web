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

export const calculateConstraintFromAttributeProfiles = (entityAttributeProfiles: AttributeProfile[] | undefined, onlyValidAttributes = false) => {
    return (
        entityAttributeProfiles
            ?.map((profile: AttributeProfile) =>
                profile?.attributes
                    ?.filter((a) => (onlyValidAttributes === true ? a.valid === true : true))
                    .map((attribute) =>
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
