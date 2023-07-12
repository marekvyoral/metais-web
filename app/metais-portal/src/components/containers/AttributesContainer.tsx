import React from 'react'

import { EnumType, AttributeConstraintEnumAllOf, useGetCiTypeUsingGET, CiType, AttributeProfile, Attribute } from '@/api'
import { useHowToDisplayConstraints } from '@/hooks/useHowToDisplay'

export interface IAtrributesContainerView {
    data: {
        ciTypeData: CiType | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
        attributeProfiles: AttributeProfile[] | undefined
        attributes: Attribute[] | undefined
    }
}

interface AttributesContainer {
    entityName: string
    View: React.FC<IAtrributesContainerView>
}

export const AttributesContainer: React.FC<AttributesContainer> = ({ entityName, View }) => {
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiTypeUsingGET(entityName)

    const attributeProfiles = ciTypeData?.attributeProfiles
    const attributes = ciTypeData?.attributes

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

    return <View data={{ attributeProfiles, ciTypeData, constraintsData, unitsData: undefined, attributes }} />
}
