import { Attribute, AttributeProfile, CiType, EnumType, useGetCiType } from '@isdd/metais-common/api'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { QueryFeedback } from '@isdd/metais-common/index'
import React from 'react'

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

    const { isLoading, isError, constraintsData, unitsData } = useDetailData({
        entityStructure: ciTypeData,
        isEntityStructureLoading: isCiTypeDataLoading,
        isEntityStructureError: isCiTypeDataError,
    })

    const attributeProfiles = ciTypeData?.attributeProfiles
    const attributes = ciTypeData?.attributes

    return (
        <QueryFeedback loading={isLoading} error={isError}>
            <View data={{ attributeProfiles, ciTypeData, constraintsData, unitsData, attributes }} />
        </QueryFeedback>
    )
}
