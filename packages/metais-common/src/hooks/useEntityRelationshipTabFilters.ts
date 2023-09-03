import { useMemo } from 'react'

import { NeighboursFilterContainerUi, RelatedCiTypePreview, RelatedCiTypePreviewList, useListRelatedCiTypes } from '@isdd/metais-common/api'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { isRelatedCiTypeCmdbView, removeDuplicates } from '@isdd/metais-common/hooks/common'

export const useEntityRelationshipTabFilters = (technicalName: string) => {
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user
    const { isLoading: isRelatedLoading, isError: isRelatedError, data: relatedData } = useListRelatedCiTypes(technicalName ?? '')
    const relatedCiTypesFilteredForView = useMemo((): RelatedCiTypePreviewList => {
        const filteredSources = relatedData?.cisAsSources?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged))
        const filteredTargets = relatedData?.cisAsTargets?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged))
        const relatedCiTypesFilteredData: RelatedCiTypePreviewList = { cisAsSources: filteredSources, cisAsTargets: filteredTargets }
        return relatedCiTypesFilteredData
    }, [relatedData, isUserLogged])

    const mapFilterToNeighboursContainerUi = (relatedCiTypePreviewArray: RelatedCiTypePreview[] | undefined): NeighboursFilterContainerUi => {
        const ciType: string[] = []
        const relType: string[] = []

        relatedCiTypePreviewArray?.forEach((relatedCiType) => {
            relatedCiType.ciTypeTechnicalName && ciType.push(relatedCiType.ciTypeTechnicalName)
            relatedCiType.relationshipTypeTechnicalName && relType.push(relatedCiType.relationshipTypeTechnicalName)
        })

        const uniqueCiType = removeDuplicates(ciType ?? [])
        const uniqueRelType = removeDuplicates(relType ?? [])

        return {
            neighboursFilter: {
                ciType: uniqueCiType,
                metaAttributes: { state: ['DRAFT'] },
                relType: uniqueRelType,
            },
        }
    }

    const defaultSourceRelationshipTabFilter: NeighboursFilterContainerUi = useMemo(
        (): NeighboursFilterContainerUi => mapFilterToNeighboursContainerUi(relatedCiTypesFilteredForView.cisAsSources),
        [relatedCiTypesFilteredForView],
    )
    const defaultTargetRelationshipTabFilter: NeighboursFilterContainerUi = useMemo(
        (): NeighboursFilterContainerUi => mapFilterToNeighboursContainerUi(relatedCiTypesFilteredForView.cisAsTargets),
        [relatedCiTypesFilteredForView],
    )

    return {
        isLoading: isRelatedLoading,
        isError: isRelatedError,
        defaultSourceRelationshipTabFilter,
        defaultTargetRelationshipTabFilter,
    }
}
