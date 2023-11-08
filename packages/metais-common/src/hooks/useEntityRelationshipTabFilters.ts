import { useCallback, useMemo } from 'react'

import { RelatedCiTypePreview, RelatedCiTypePreviewList, useListRelatedCiTypes } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { isRelatedCiTypeCmdbView, removeDuplicates } from '@isdd/metais-common/hooks/common'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { NeighboursFilterContainerUi } from '@isdd/metais-common/api/generated/cmdb-swagger'

export const useEntityRelationshipTabFilters = (technicalName: string) => {
    const { userInfo: user } = useAuth()
    const { currentPreferences } = useUserPreferences()
    const isUserLogged = !!user
    const { isLoading: isRelatedLoading, isError: isRelatedError, data: relatedData } = useListRelatedCiTypes(technicalName ?? '')
    const relatedCiTypesFilteredForView = useMemo((): RelatedCiTypePreviewList => {
        const filteredSources = relatedData?.cisAsSources?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged))
        const filteredTargets = relatedData?.cisAsTargets?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged))
        const relatedCiTypesFilteredData: RelatedCiTypePreviewList = { cisAsSources: filteredSources, cisAsTargets: filteredTargets }
        return relatedCiTypesFilteredData
    }, [relatedData, isUserLogged])

    const mapFilterToNeighboursContainerUi = useCallback(
        (relatedCiTypePreviewArray: RelatedCiTypePreview[] | undefined): NeighboursFilterContainerUi => {
            const ciType: string[] = []
            const relType: string[] = []

            relatedCiTypePreviewArray?.forEach((relatedCiType) => {
                relatedCiType.ciTypeTechnicalName && ciType.push(relatedCiType.ciTypeTechnicalName)
                relatedCiType.relationshipTypeTechnicalName && relType.push(relatedCiType.relationshipTypeTechnicalName)
            })

            const uniqueCiType = removeDuplicates(ciType)
            const uniqueRelType = removeDuplicates(relType)

            const metaAttributes = currentPreferences.showInvalidatedItems ? { state: ['DRAFT', 'INVALIDATED'] } : { state: ['DRAFT'] }

            return {
                neighboursFilter: {
                    ciType: uniqueCiType,
                    metaAttributes,
                    relType: uniqueRelType,
                },
            }
        },
        [currentPreferences.showInvalidatedItems],
    )

    const defaultSourceRelationshipTabFilter: NeighboursFilterContainerUi = useMemo(
        (): NeighboursFilterContainerUi => mapFilterToNeighboursContainerUi(relatedCiTypesFilteredForView.cisAsTargets),
        [mapFilterToNeighboursContainerUi, relatedCiTypesFilteredForView.cisAsTargets],
    )
    const defaultTargetRelationshipTabFilter: NeighboursFilterContainerUi = useMemo(
        (): NeighboursFilterContainerUi => mapFilterToNeighboursContainerUi(relatedCiTypesFilteredForView.cisAsSources),
        [mapFilterToNeighboursContainerUi, relatedCiTypesFilteredForView.cisAsSources],
    )

    return {
        isLoading: isRelatedLoading,
        isError: isRelatedError,
        defaultSourceRelationshipTabFilter,
        defaultTargetRelationshipTabFilter,
    }
}
