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
    useDeleteAttributeTextationUsingDELETE1,
} from '@isdd/metais-common/api'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { setValidity } from '@isdd/metais-common/componentHelpers/mutationsHelpers/mutation'
import { QueryFeedback } from '@isdd/metais-common'
import { createTabNamesAndValuesMap } from '@isdd/metais-common/hooks/useEntityProfiles'

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
    saveExistingAttribute?: (attributeTechnicalName?: string, attribute?: Attribute) => void
    resetExistingAttribute?: (attributeTechnicalName?: string) => void
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

    const keysToDisplay = createTabNamesAndValuesMap(ciTypeData?.attributeProfiles)

    const { isLoading, isError, constraintsData } = useDetailData({
        entityStructure: ciTypeData,
        isEntityStructureLoading: isCiTypeDataLoading,
        isEntityStructureError: isCiTypeDataError,
    })

    const { mutateAsync: setRelationAsValid } = useUnvalidRelationshipTypeUsingDELETE()
    const { mutateAsync: setRelationAsInvalid } = useValidRelationshipTypeUsingPUT()
    const { mutateAsync: addConnection } = useStoreExistsCiTypeRelationshipTypeMapUsingPUT()
    const { mutateAsync: saveAttribute } = useStoreAttributeTextationUsingPUT1()
    const { mutateAsync: resetAttribute } = useDeleteAttributeTextationUsingDELETE1()

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

    const saveExistingAttribute = (attributeTechnicalName?: string, attribute?: Attribute) => {
        saveAttribute({
            technicalName: ciTypeData?.technicalName ?? '',
            attTecName: attributeTechnicalName ?? '',
            data: {
                ...attribute,
            },
        })
            .then(() => {
                refetch()
                refetchAttributes()
            })
            .catch(() => {
                refetch()
                refetchAttributes()
            })
    }

    const resetExistingAttribute = (attributeTechnicalName?: string) => {
        resetAttribute({
            technicalName: ciTypeData?.technicalName ?? '',
            attTecName: attributeTechnicalName ?? '',
        })
            .then(() => {
                refetch()
                refetchAttributes()
            })
            .catch(() => {
                refetch()
                refetchAttributes()
            })
    }

    return (
        <QueryFeedback loading={isLoading || isAttributesOverridesLoading} error={isError || isAttributesOverridesError}>
            <View
                data={{ ciTypeData, constraintsData, unitsData: undefined, keysToDisplay, attributeOverridesData }}
                unValidRelationShipTypeMutation={unValidRelationShipTypeMutation}
                addNewConnectionToExistingRelation={addNewConnectionToExistingRelation}
                saveExistingAttribute={saveExistingAttribute}
                resetExistingAttribute={resetExistingAttribute}
            />
        </QueryFeedback>
    )
}
