import React from 'react'
import {
    EnumType,
    useGetRelationshipTypeUsingGET,
    RelationshipType,
    AttributeProfile,
    useUnvalidRelationshipTypeUsingDELETE,
} from '@isdd/metais-common/api'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'

export interface IAtrributesContainerView {
    data: {
        ciTypeData: RelationshipType | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
        keysToDisplay: Map<string, AttributeProfile | undefined>
    }
    unValidRelationShipTypeMutation?: (technicalName?: string) => void
}

interface AttributesContainer {
    entityName: string
    View: React.FC<IAtrributesContainerView>
}

export const RelationDetailContainer: React.FC<AttributesContainer> = ({ entityName, View }) => {
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError } = useGetRelationshipTypeUsingGET(entityName)

    const keysToDisplay = new Map<string, AttributeProfile | undefined>()
    ciTypeData?.attributeProfiles?.map((attribute) => {
        keysToDisplay.set(attribute?.name ?? '', attribute)
    })

    const { isLoading, isError, constraintsData } = useDetailData({
        entityStructure: ciTypeData,
        isEntityStructureLoading: isCiTypeDataLoading,
        isEntityStructureError: isCiTypeDataError,
    })

    const { mutateAsync } = useUnvalidRelationshipTypeUsingDELETE()

    const unValidRelationShipTypeMutation = async (technicalName?: string) => {
        await mutateAsync({
            technicalName: technicalName ?? '',
        }).then((values) => {
            console.log('VALUES: ', values)
        })
    }

    if (isLoading) {
        return <div>Loading</div>
    }
    if (isError) {
        return <div>Error</div>
    }

    return (
        <View
            data={{ ciTypeData, constraintsData, unitsData: undefined, keysToDisplay }}
            unValidRelationShipTypeMutation={unValidRelationShipTypeMutation}
        />
    )
}
