import React from 'react'
import { EnumType, CiType, SummarizingCardUi, AttributeProfile, useUnvalidRelationshipTypeUsingDELETE } from '@isdd/metais-common/api'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { useEntityProfiles } from '@isdd/metais-common/hooks/useEntityProfiles'

export interface IAtrributesContainerView {
    data: {
        ciTypeData: CiType | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
        summarizingCardData?: SummarizingCardUi | undefined
        keysToDisplay: Map<string, CiType | AttributeProfile | undefined>
    }
}

interface AttributesContainer {
    entityName: string
    View: React.FC<IAtrributesContainerView>
}

export const EntityDetailContainer: React.FC<AttributesContainer> = ({ entityName, View }) => {
    const {
        ciTypeData,
        isLoading: isCiTypeDataLoading,
        isError: isCiTypeDataError,
        summarizingCardData,
        keysToDisplay,
    } = useEntityProfiles(entityName)

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

    return <View data={{ ciTypeData, constraintsData, unitsData: undefined, summarizingCardData, keysToDisplay }} />
}
