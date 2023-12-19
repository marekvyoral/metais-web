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
import { FindAll11200, useFindAll11 } from '@isdd/metais-common/api/generated/iam-swagger'

export interface IRelationDetailContainerView {
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
    roles?: FindAll11200 | undefined
}

interface IRelationDetailContainer {
    entityName: string
    View: React.FC<IRelationDetailContainerView>
}

export const RelationDetailContainer: React.FC<IRelationDetailContainer> = ({ entityName, View }) => {
    const {
        data: ciTypeData,
        isLoading: isCiTypeDataLoading,
        isError: isCiTypeDataError,
        refetch,
        isFetching: isCiTypeDataFetching,
    } = useGetRelationshipType(entityName)
    const {
        data: attributeOverridesData,
        isLoading: isAttributesOverridesLoading,
        isError: isAttributesOverridesError,
        refetch: refetchAttributes,
        isFetching: isAttributesOverridesFetching,
    } = useGetAttributeOverrides(entityName)

    const keysToDisplay = createTabNamesAndValuesMap(ciTypeData?.attributeProfiles)
    const { data: roles } = useFindAll11()

    const {
        isLoading: useDetailDataLoading,
        isError,
        constraintsData,
    } = useDetailData({
        entityStructure: ciTypeData,
        isEntityStructureLoading: isCiTypeDataLoading,
        isEntityStructureError: isCiTypeDataError,
    })

    const { mutateAsync: setRelationAsValid, isLoading: setRelationAsValidLoading } = useValidRelationshipType()
    const { mutateAsync: setRelationAsInvalid, isLoading: setRelationAsInvalidLoading } = useUnvalidRelationshipType()
    const { mutateAsync: addConnection, isLoading: addConnectionLoading } = useStoreExistsCiTypeRelationshipTypeMap()
    const { mutateAsync: saveAttribute, isLoading: saveAttributeLoading } = useStoreAttributeTextation()
    const { mutateAsync: resetAttribute, isLoading: resetAttributeLoading } = useDeleteAttributeTextation()

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
    const isLoading =
        useDetailDataLoading ||
        isAttributesOverridesLoading ||
        isCiTypeDataLoading ||
        setRelationAsValidLoading ||
        setRelationAsInvalidLoading ||
        addConnectionLoading ||
        saveAttributeLoading ||
        resetAttributeLoading

    const isFetching = isCiTypeDataFetching || isAttributesOverridesFetching

    return (
        <View
            data={{ ciTypeData, constraintsData, unitsData: undefined, keysToDisplay, attributeOverridesData }}
            unValidRelationShipTypeMutation={unValidRelationShipTypeMutation}
            addNewConnectionToExistingRelation={addNewConnectionToExistingRelation}
            saveExistingAttribute={saveExistingAttribute}
            resetExistingAttribute={resetExistingAttribute}
            isLoading={isLoading || isFetching}
            isError={isError || isAttributesOverridesError}
            roles={roles}
        />
    )
}
