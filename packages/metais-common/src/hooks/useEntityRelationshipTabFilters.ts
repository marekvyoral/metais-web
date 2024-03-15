import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useListRelatedCiTypesWrapper } from './useListRelatedCiTypes.hook'

import { RelatedCiTypePreview, RelatedCiTypePreviewList } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { isRelatedCiTypeCmdbView, removeDuplicates } from '@isdd/metais-common/hooks/common'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { FilterMetaAttributesUi } from '@isdd/metais-common/api/generated/cmdb-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export interface NeighboursFilterUiCustom {
    relType?: { label: string; value: string }[]
    ciType?: { label: string; value: string }[]
    usageType?: string[]
    fullTextSearch?: string
    searchFields?: string[]
    filterType?: string
    metaAttributes?: FilterMetaAttributesUi
    excludedRelTypes?: string[]
    excludedCiUuids?: string[]
}

export interface NeighboursFilterContainerUiCustom {
    page?: number
    perpage?: number
    sortBy?: string
    sortType?: string
    sortSource?: string
    neighboursFilter?: NeighboursFilterUiCustom
}
export const useEntityRelationshipTabFilters = (technicalName: string) => {
    const {
        state: { user },
    } = useAuth()
    const { i18n } = useTranslation()
    const { currentPreferences } = useUserPreferences()
    const isUserLogged = !!user
    const { isLoading: isRelatedLoading, isError: isRelatedError, data: relatedData } = useListRelatedCiTypesWrapper(technicalName ?? '')
    const relatedCiTypesFilteredForView = useMemo((): RelatedCiTypePreviewList => {
        const filteredSources = relatedData?.cisAsSources?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged, false))
        const filteredTargets = relatedData?.cisAsTargets?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged, false))
        const relatedCiTypesFilteredData: RelatedCiTypePreviewList = { cisAsSources: filteredSources, cisAsTargets: filteredTargets }

        return relatedCiTypesFilteredData
    }, [relatedData, isUserLogged])

    const mapFilterToNeighboursContainerUi = useCallback(
        (relatedCiTypePreviewArray: RelatedCiTypePreview[] | undefined): NeighboursFilterContainerUiCustom => {
            const ciType: { label: string; value: string }[] = []
            const relType: { label: string; value: string }[] = []

            relatedCiTypePreviewArray?.forEach((relatedCiType) => {
                i18n.language == 'sk'
                    ? relatedCiType.ciTypeName &&
                      relatedCiType.ciTypeTechnicalName &&
                      ciType.push({ label: relatedCiType.ciTypeName, value: relatedCiType.ciTypeTechnicalName })
                    : relatedCiType.engCiTypeName &&
                      relatedCiType.ciTypeTechnicalName &&
                      ciType.push({ label: relatedCiType.engCiTypeName, value: relatedCiType.ciTypeTechnicalName })
                i18n.language == 'sk'
                    ? relatedCiType.relationshipTypeName &&
                      relatedCiType.relationshipTypeTechnicalName &&
                      relType.push({ label: relatedCiType.relationshipTypeName, value: relatedCiType.relationshipTypeTechnicalName })
                    : relatedCiType.engRelationshipTypeName &&
                      relatedCiType.relationshipTypeTechnicalName &&
                      relType.push({ label: relatedCiType.engRelationshipTypeName, value: relatedCiType.relationshipTypeTechnicalName })
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
        [currentPreferences.showInvalidatedItems, i18n.language],
    )

    const defaultSourceRelationshipTabFilter: NeighboursFilterContainerUiCustom = useMemo(
        (): NeighboursFilterContainerUiCustom => mapFilterToNeighboursContainerUi(relatedCiTypesFilteredForView.cisAsTargets),
        [mapFilterToNeighboursContainerUi, relatedCiTypesFilteredForView.cisAsTargets],
    )
    const defaultTargetRelationshipTabFilter: NeighboursFilterContainerUiCustom = useMemo(
        (): NeighboursFilterContainerUiCustom => mapFilterToNeighboursContainerUi(relatedCiTypesFilteredForView.cisAsSources),
        [mapFilterToNeighboursContainerUi, relatedCiTypesFilteredForView.cisAsSources],
    )

    return {
        isLoading: isRelatedLoading,
        isError: isRelatedError,
        defaultSourceRelationshipTabFilter,
        defaultTargetRelationshipTabFilter,
    }
}
