import React from 'react'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { EnumType, AttributeConstraintEnumAllOf, useGetCiType, CiType, AttributeProfile, Attribute, useGetEnum } from '@isdd/metais-common/api'
import { useHowToDisplayConstraints } from '@isdd/metais-common/src/hooks/useHowToDisplay'
import { MEASURE_UNIT } from '@isdd/metais-common/src/hooks/constants'

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
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetCiType(entityName)

    let { isLoading, isError, constraintsData } = useDetailData({
        entityStructure: ciTypeData,
        isEntityStructureLoading: isCiTypeDataLoading,
        isEntityStructureError: isCiTypeDataError,
    })

    const attributeProfiles = ciTypeData?.attributeProfiles
    const attributes = ciTypeData?.attributes

    const constraintsAttributes =
        ciTypeData?.attributes
            ?.map((attribute) =>
                attribute?.constraints
                    ?.filter((item) => item.type === 'enum')
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-ignore
                    .map((constraint: AttributeConstraintEnumAllOf) => constraint?.enumCode),
            )
            .flat() ?? []

    const constraintsAttributesProfiles =
        ciTypeData?.attributeProfiles
            ?.map((profile) =>
                profile?.attributes?.map((attribute) =>
                    attribute?.constraints
                        ?.filter((item) => item.type === 'enum')
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //@ts-ignore
                        .map((constraint: AttributeConstraintEnumAllOf) => constraint?.enumCode),
                ),
            )
            .flat(2) ?? []

    const constraints = [...constraintsAttributes, ...constraintsAttributesProfiles]

    const { isLoading: isUnitsLoading, isError: isUnitsError, data: unitsData } = useGetEnum(MEASURE_UNIT)
    const { isLoading: isConstraintLoading, isError: isConstraintError, resultList } = useHowToDisplayConstraints(constraints)

    constraintsData = resultList.map((item) => item.data)
    isLoading = [isCiTypeDataLoading, isConstraintLoading, isUnitsLoading, isUnitsError].some((item) => item) //isUnitsLoading,
    isError = [isCiTypeDataError, isConstraintError].some((item) => item) //isUnitsError,

    if (isLoading) {
        return <div>Loading</div>
    }
    if (isError) {
        return <div>Error</div>
    }

    return <View data={{ attributeProfiles, ciTypeData, constraintsData, unitsData, attributes }} />
}
