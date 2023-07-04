import React from 'react'
import { EnumType, AttributeConstraintEnumAllOf, useGetRelationshipTypeUsingGET, RelationshipType, AttributeProfile } from '@isdd/metais-common/api'
import { useHowToDisplayConstraints } from '@isdd/metais-common/hooks/useHowToDisplay'

export interface IAtrributesContainerView {
    data: {
        ciTypeData: RelationshipType | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
        keysToDisplay: Map<string, AttributeProfile | undefined>
    }
}

interface AttributesContainer {
    entityName: string
    View: React.FC<IAtrributesContainerView>
}

export const RelationDetailContainer: React.FC<AttributesContainer> = ({ entityName, View }) => {
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetRelationshipTypeUsingGET(entityName)

    const constraintsAttributes =
        ciTypeData?.attributes
            ?.map((attribute) =>
                attribute?.constraints
                    ?.filter((item) => item.type === 'enum')
                    .map((constraint: AttributeConstraintEnumAllOf) => constraint?.enumCode),
            )
            .flat() ?? []

    const constraintsAttributesProfiles =
        ciTypeData?.attributeProfiles
            ?.map((profile) =>
                profile?.attributes?.map((attribute) =>
                    attribute?.constraints
                        ?.filter((item) => item.type === 'enum')
                        .map((constraint: AttributeConstraintEnumAllOf) => constraint?.enumCode),
                ),
            )
            .flat(2) ?? []

    const constraints = [...constraintsAttributes, ...constraintsAttributesProfiles]
    const keysToDisplay = new Map<string, AttributeProfile | undefined>()
    ciTypeData?.attributeProfiles?.map((attribute) => {
        keysToDisplay.set(attribute?.name ?? '', attribute)
    })
    // const { isLoading: isUnitsLoading, isError: isUnitsError, data: unitsData } = useGetEnumUsingGET(MEASURE_UNIT)
    const { isLoading: isConstraintLoading, isError: isConstraintError, resultList } = useHowToDisplayConstraints(constraints)

    const constraintsData = resultList.map((item) => item.data)
    const isLoading = [isCiTypeDataLoading, isConstraintLoading].some((item) => item) //isUnitsLoading,
    const isError = [isCiTypeDataError, isConstraintError].some((item) => item) //isUnitsError,

    if (isLoading) {
        return <div>Loading</div>
    }
    if (isError) {
        return <div>Error</div>
    }

    return <View data={{ ciTypeData, constraintsData, unitsData: undefined, keysToDisplay }} />
}
