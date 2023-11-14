import React from 'react'
import {
    useGetRelationshipType,
    RelationshipType,
    AttributeProfile,
    useUnvalidRelationshipType,
    useValidRelationshipType,
    useStoreExistsCiTypeRelationshipTypeMap,
    CiTypePreview,
    useGetAttributeOverrides,
    Attribute,
    useStoreAttributeTextation,
    useDeleteAttributeTextation,
} from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { setValidity } from '@isdd/metais-common/componentHelpers/mutationsHelpers/mutation'
import { createTabNamesAndValuesMap } from '@isdd/metais-common/hooks/useEntityProfiles'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'

export interface IAttributesContainerView {
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
    isLoading: boolean
    isError: boolean
}

interface AttributesContainer {
    entityName: string
    View: React.FC<IAttributesContainerView>
}

export const RelationDetailContainer: React.FC<AttributesContainer> = ({ entityName, View }) => {
    const { data: ciTypeData, isLoading: isCiTypeDataLoading, isError: isCiTypeDataError, refetch } = useGetRelationshipType(entityName)
    const {
        data: attributeOverridesData,
        isLoading: isAttributesOverridesLoading,
        isError: isAttributesOverridesError,
        refetch: refetchAttributes,
    } = useGetAttributeOverrides(entityName)

    const keysToDisplay = createTabNamesAndValuesMap(ciTypeData?.attributeProfiles)

    const { isLoading, isError, constraintsData } = useDetailData({
        entityStructure: ciTypeData,
        isEntityStructureLoading: isCiTypeDataLoading,
        isEntityStructureError: isCiTypeDataError,
    })

    const { mutateAsync: setRelationAsValid } = useUnvalidRelationshipType()
    const { mutateAsync: setRelationAsInvalid } = useValidRelationshipType()
    const { mutateAsync: addConnection } = useStoreExistsCiTypeRelationshipTypeMap()
    const { mutateAsync: saveAttribute } = useStoreAttributeTextation()
    const { mutateAsync: resetAttribute } = useDeleteAttributeTextation()

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
        <View
            data={{ ciTypeData, constraintsData, unitsData: undefined, keysToDisplay, attributeOverridesData }}
            unValidRelationShipTypeMutation={unValidRelationShipTypeMutation}
            addNewConnectionToExistingRelation={addNewConnectionToExistingRelation}
            saveExistingAttribute={saveExistingAttribute}
            resetExistingAttribute={resetExistingAttribute}
            isLoading={isLoading || isAttributesOverridesLoading}
            isError={isError || isAttributesOverridesError}
        />
    )
}
