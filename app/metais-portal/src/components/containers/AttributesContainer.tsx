import { EnumType } from '@isdd/metais-common/api'
import { Attribute, AttributeProfile, CiType, useGetCiType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import React from 'react'

export interface AttributesContainerViewData {
    ciTypeData: CiType | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData?: EnumType | undefined
    attributeProfiles: AttributeProfile[] | undefined
    attributes: Attribute[] | undefined
}

export interface IAtrributesContainerView {
    data: AttributesContainerViewData
    isLoading: boolean
    isError: boolean
}

interface AttributesContainer {
    entityName: string
    loadingWithChildren?: boolean
    loadingLabel?: string
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

    return <View data={{ attributeProfiles, ciTypeData, constraintsData, unitsData, attributes }} isLoading={isLoading} isError={isError} />
}
