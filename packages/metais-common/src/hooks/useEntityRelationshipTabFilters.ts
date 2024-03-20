import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { IOption } from '@isdd/idsk-ui-kit'

import { useListRelatedCiTypesWrapper } from './useListRelatedCiTypes.hook'

import { RelatedCiTypePreview, RelatedCiTypePreviewList } from '@isdd/metais-common/api/generated/types-repo-swagger'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'
import { useUserPreferences } from '@isdd/metais-common/contexts/userPreferences/userPreferencesContext'
import { isRelatedCiTypeCmdbView, removeDuplicates } from '@isdd/metais-common/hooks/common'

export interface IRelationshipTabFilters {
    neighboursFilter: {
        ciType: IOption<string>[]
        relType: IOption<string>[]
        metaAttributes: {
            state: string[]
        }
    }
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
        (relatedCiTypePreviewArray: RelatedCiTypePreview[] | undefined): IRelationshipTabFilters => {
            const ciType: IOption<string>[] = []
            const relType: IOption<string>[] = []

            relatedCiTypePreviewArray?.forEach((relatedCiType) => {
                if (relatedCiType.ciTypeTechnicalName) {
                    i18n.language == 'sk'
                        ? relatedCiType.ciTypeName && ciType.push({ label: relatedCiType.ciTypeName, value: relatedCiType.ciTypeTechnicalName })
                        : relatedCiType.engCiTypeName && ciType.push({ label: relatedCiType.engCiTypeName, value: relatedCiType.ciTypeTechnicalName })
                }
                if (relatedCiType.relationshipTypeTechnicalName) {
                    i18n.language == 'sk'
                        ? relatedCiType.relationshipTypeName &&
                          relType.push({ label: relatedCiType.relationshipTypeName, value: relatedCiType.relationshipTypeTechnicalName })
                        : relatedCiType.engRelationshipTypeName &&
                          relType.push({ label: relatedCiType.engRelationshipTypeName, value: relatedCiType.relationshipTypeTechnicalName })
                }
            })

            const uniqueCiType = removeDuplicates(ciType, 'value')
            const uniqueRelType = removeDuplicates(relType, 'value')

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

    const defaultSourceRelationshipTabFilter: IRelationshipTabFilters = useMemo(
        (): IRelationshipTabFilters => mapFilterToNeighboursContainerUi(relatedCiTypesFilteredForView.cisAsTargets),
        [mapFilterToNeighboursContainerUi, relatedCiTypesFilteredForView.cisAsTargets],
    )
    const defaultTargetRelationshipTabFilter: IRelationshipTabFilters = useMemo(
        (): IRelationshipTabFilters => mapFilterToNeighboursContainerUi(relatedCiTypesFilteredForView.cisAsSources),
        [mapFilterToNeighboursContainerUi, relatedCiTypesFilteredForView.cisAsSources],
    )

    return {
        isLoading: isRelatedLoading,
        isError: isRelatedError,
        defaultSourceRelationshipTabFilter,
        defaultTargetRelationshipTabFilter,
    }
}
