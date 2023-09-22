import {
    EnumType,
    IncidentRelationshipSetUi,
    RelatedCiTypePreview,
    RelationshipType,
    useGetRelationshipType,
    useListRelatedCiTypes,
    useReadRelationships,
} from '@isdd/metais-common/api'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import React, { Dispatch, SetStateAction, useState } from 'react'

import { filterRelatedList } from '@/componentHelpers/new-relation'

export interface INewCiRelationData {
    relatedListAsSources: RelatedCiTypePreview[]
    relatedListAsTargets: RelatedCiTypePreview[]
    readRelationShipsData: IncidentRelationshipSetUi | undefined
    relationTypeData: RelationshipType | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData: EnumType | undefined
}

export interface ISelectedRelationTypeState {
    selectedRelationTypeTechnicalName: string
    setSelectedRelationTypeTechnicalName: Dispatch<SetStateAction<string>>
}

export interface INewCiRelationContainerView {
    isLoading: boolean
    isError: boolean
    selectedRelationTypeState: ISelectedRelationTypeState
    data?: INewCiRelationData
}

interface INewCiRelationContainer {
    configurationItemId: string
    entityName: string
    tabName: string
    View: React.FC<INewCiRelationContainerView>
}

export const NewCiRelationContainer: React.FC<INewCiRelationContainer> = ({ configurationItemId, entityName, tabName, View }) => {
    const [selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName] = useState<string>('')

    const { data: relatedListData, isLoading: isRelatedListLoading, isError: isRelatedListError } = useListRelatedCiTypes(entityName)

    //build select options from this data
    const relatedListAsSources = filterRelatedList(relatedListData?.cisAsSources, tabName)
    const relatedListAsTargets = filterRelatedList(relatedListData?.cisAsTargets, tabName)

    //selectedTechName
    const {
        data: readRelationShipsData,
        isLoading: isReadRelationshipsLoading,
        isError: isReadRelationshipsError,
    } = useReadRelationships(configurationItemId ?? '')

    //selectedTechName
    const combinedRelatedLists = [...relatedListAsSources, ...relatedListAsTargets]
    const firstRelatedItemTechName = combinedRelatedLists[0]?.relationshipTypeTechnicalName
    const {
        data: relationTypeData,
        isLoading: isRelationTypeDataLoading,
        isError: isRelationTypeDataError,
    } = useGetRelationshipType(selectedRelationTypeTechnicalName ? selectedRelationTypeTechnicalName : firstRelatedItemTechName ?? '', {
        query: { enabled: !!firstRelatedItemTechName },
    })

    const {
        isLoading: isDetailDataLoading,
        isError: isDetailDataError,
        constraintsData,
        unitsData,
    } = useDetailData({
        entityStructure: relationTypeData,
        isEntityStructureLoading: isRelationTypeDataLoading,
        isEntityStructureError: isRelationTypeDataError,
    })

    const isLoading = [isReadRelationshipsLoading, isRelatedListLoading, isRelationTypeDataLoading, isDetailDataLoading].some((item) => item)
    const isError = [isReadRelationshipsError, isRelatedListError, isRelationTypeDataError, isDetailDataError].some((item) => item)

    if (!configurationItemId)
        return (
            <View selectedRelationTypeState={{ selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName }} isLoading={false} isError />
        )
    return (
        <View
            data={{ relatedListAsSources, relatedListAsTargets, readRelationShipsData, relationTypeData, constraintsData, unitsData }}
            selectedRelationTypeState={{ selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName }}
            isLoading={isLoading}
            isError={isError}
        />
    )
}
