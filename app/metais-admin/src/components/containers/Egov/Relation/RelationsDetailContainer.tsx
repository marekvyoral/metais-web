import React from 'react'
import {
    EnumType,
    useGetRelationshipTypeUsingGET,
    RelationshipType,
    AttributeProfile,
    useUnvalidRelationshipTypeUsingDELETE,
    useValidRelationshipTypeUsingPUT,
    useStoreExistsCiTypeRelationshipTypeMapUsingPUT,
    CiTypePreview,
    useGetAttributeOverridesUsingGET1,
    Attribute,
    useStoreAttributeTextationUsingPUT1,
} from '@isdd/metais-common/api'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { setValidity } from '@isdd/metais-common/componentHelpers/mutationsHelpers/mutation'

export interface IAtrributesContainerView {
    data: {
        ciTypeData: RelationshipType | undefined
        attributeOverridesData: Attribute[] | undefined
        constraintsData: (EnumType | undefined)[]
        unitsData?: EnumType | undefined
        keysToDisplay: Map<string, AttributeProfile | undefined>
    }
    unValidRelationShipTypeMutation?: (technicalName?: string) => void
    addNewConnectionToExistingRelation?: (selectedConnection: CiTypePreview, ciTypeRoleEnum: 'TARGET' | 'SOURCE') => void
    editExistingAttribute?: (attributeTechnicalName?: string, attribute?: Attribute) => void
}

interface AttributesContainer {
    entityName: string
    View: React.FC<IAtrributesContainerView>
}

export const RelationDetailContainer: React.FC<AttributesContainer> = ({ entityName, View }) => {
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError, refetch } = useGetRelationshipTypeUsingGET(entityName)
    const {
        data: attributeOverridesData,
        isLoading: isAttributesOverridesLoading,
        isError: isAttributesOverridesError,
        refetch: refetchAttributes,
    } = useGetAttributeOverridesUsingGET1(entityName)

    const keysToDisplay = new Map<string, AttributeProfile | undefined>()

    ciTypeData?.attributeProfiles?.map((attribute) => {
        keysToDisplay.set(attribute?.name ?? '', attribute)
    })

    const { isLoading, isError, constraintsData } = useDetailData({
        entityStructure: ciTypeData,
        isEntityStructureLoading: isCiTypeDataLoading,
        isEntityStructureError: isCiTypeDataError,
    })

    const { mutateAsync: setRelationAsValid } = useUnvalidRelationshipTypeUsingDELETE()
    const { mutateAsync: setRelationAsInvalid } = useValidRelationshipTypeUsingPUT()
    const { mutateAsync: addConnection } = useStoreExistsCiTypeRelationshipTypeMapUsingPUT()
    const { mutateAsync: editAttribute } = useStoreAttributeTextationUsingPUT1()

    const unValidRelationShipTypeMutation = async (technicalName?: string) => {
        setValidity(technicalName, ciTypeData?.valid, setRelationAsValid, setRelationAsInvalid, refetch)
    }

    const addNewConnectionToExistingRelation = (selectedConnection: CiTypePreview, ciTypeRoleEnum: 'TARGET' | 'SOURCE') => {
        addConnection({
            data: {
                ciTypeId: selectedConnection?.id,
                ciTypeRoleEnum,
                id: selectedConnection?.id,
                relationshipTypeid: ciTypeData?.id,
            },
        })
            .then(() => {
                refetch()
            })
            .catch(() => {
                refetch()
            })
    }

    const editExistingAttribute = (attributeTechnicalName?: string, attribute?: Attribute) => {
        editAttribute({
            technicalName: ciTypeData?.technicalName ?? '',
            attTecName: attributeTechnicalName ?? '',
            data: {
                ...attribute,
            },
        })
            .then(() => {
                refetchAttributes()
            })
            .catch(() => {
                refetchAttributes()
            })
    }

    if (isLoading || isAttributesOverridesLoading) {
        return <div>Loading</div>
    }
    if (isError || isAttributesOverridesError) {
        return <div>Error</div>
    }

    return (
        <View
            data={{ ciTypeData, constraintsData, unitsData: undefined, keysToDisplay, attributeOverridesData }}
            unValidRelationShipTypeMutation={unValidRelationShipTypeMutation}
            addNewConnectionToExistingRelation={addNewConnectionToExistingRelation}
            editExistingAttribute={editExistingAttribute}
        />
    )
}
