import { IncidentRelationshipSetUi, useReadRelationships } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { EnumType } from '@isdd/metais-common/api/generated/enums-repo-swagger'
import { CiType, RelatedCiTypePreview, RelationshipType } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useDetailData } from '@isdd/metais-common/hooks/useDetailData'
import { Dispatch, SetStateAction, useState } from 'react'
import { useGetCiTypeWrapper } from '@isdd/metais-common/hooks/useCiType.hook'
import { useGetRelationshipTypeWrapper } from '@isdd/metais-common/hooks/useRelationshipType.hook'
import { useListRelatedCiTypesWrapper } from '@isdd/metais-common/hooks/useListRelatedCiTypes.hook'

import { filterRelatedList } from '@/componentHelpers/new-relation'

export interface INewCiRelationData {
    relatedListAsSources: RelatedCiTypePreview[]
    relatedListAsTargets: RelatedCiTypePreview[]
    readRelationShipsData: IncidentRelationshipSetUi | undefined
    relationTypeData: RelationshipType | undefined
    constraintsData: (EnumType | undefined)[]
    unitsData: EnumType | undefined
    ciTypeData: CiType | undefined
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

interface INewCiRelationProps {
    configurationItemId?: string
    entityName: string
    tabName: string
}

export const useNewCiRelationHook = ({ configurationItemId, entityName, tabName }: INewCiRelationProps) => {
    const [selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName] = useState<string>('')

    const { data: ciTypeData, isLoading: isCiTypeLoading, isError: isCiTypeError } = useGetCiTypeWrapper(entityName ?? '')

    const { data: relatedListData, isLoading: isRelatedListLoading, isError: isRelatedListError } = useListRelatedCiTypesWrapper(entityName)

    //build select options from this data
    const relatedListAsSources = filterRelatedList(relatedListData?.cisAsSources, tabName)
    const relatedListAsTargets = filterRelatedList(relatedListData?.cisAsTargets, tabName)

    //selectedTechName
    const {
        data: readRelationShipsData,
        isLoading: isReadRelationshipsLoading,
        isError: isReadRelationshipsError,
    } = useReadRelationships(configurationItemId ?? '', undefined, {
        query: {
            enabled: !!configurationItemId,
        },
    })

    //selectedTechName
    const combinedRelatedLists = [...relatedListAsSources, ...relatedListAsTargets]
    const firstRelatedItemTechName = combinedRelatedLists[0]?.relationshipTypeTechnicalName
    const {
        data: relationTypeData,
        isLoading: isRelationTypeDataLoading,
        isError: isRelationTypeDataError,
    } = useGetRelationshipTypeWrapper(selectedRelationTypeTechnicalName ? selectedRelationTypeTechnicalName : firstRelatedItemTechName ?? '', {
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

    const isLoading = [isReadRelationshipsLoading, isRelatedListLoading, isRelationTypeDataLoading, isDetailDataLoading, isCiTypeLoading].some(
        (item) => item,
    )
    const isError = [isReadRelationshipsError, isRelatedListError, isRelationTypeDataError, isDetailDataError, isCiTypeError].some((item) => item)

    return {
        data: { relatedListAsSources, relatedListAsTargets, readRelationShipsData, relationTypeData, constraintsData, unitsData, ciTypeData },
        selectedRelationTypeState: { selectedRelationTypeTechnicalName, setSelectedRelationTypeTechnicalName },
        isLoading: isLoading,
        isError: isError,
    }
}
