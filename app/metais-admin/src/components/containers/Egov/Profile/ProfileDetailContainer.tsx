import React from 'react'
import { EnumType, useGetAttributeProfileUsingGET, AttributeProfile } from '@isdd/metais-common/api'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'

export interface IAtrributesContainerView {
    data: {
        ciTypeData: AttributeProfile | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
    }
}

interface AttributesContainer {
    entityName: string
    View: React.FC<IAtrributesContainerView>
}

export const ProfileDetailContainer: React.FC<AttributesContainer> = ({ entityName, View }) => {
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetAttributeProfileUsingGET(entityName)

    const { isLoading, isError, constraintsData } = useDetailData({
        entityStructure: ciTypeData,
        isEntityStructureLoading: isCiTypeDataLoading,
        isEntityStructureError: isCiTypeDataError,
    })

    if (isLoading) {
        return <div>Loading</div>
    }
    if (isError) {
        return <div>Error</div>
    }

    return <View data={{ ciTypeData, constraintsData, unitsData: undefined }} />
}
