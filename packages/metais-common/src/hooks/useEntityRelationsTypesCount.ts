import { useMemo } from 'react'

import { removeDuplicates } from './commonFunctions'
import { isRelatedCiTypeCmdbView } from './constants'

import {
    RelatedCiTypePreview,
    RelatedCiTypePreviewList,
    useListRelatedCiTypes,
    useReadNeighboursConfigurationItemsCount,
} from '@isdd/metais-common/api'
import { useAuth } from '@isdd/metais-common/contexts/auth/authContext'

export interface IKeyToDisplay {
    tabName: string
    technicalName: string
    count: number
}

export interface IEntityRelationsTypesCount {
    isLoading: boolean
    isError: boolean
    data: RelatedCiTypePreview[]
    keysToDisplay: IKeyToDisplay[]
}

export const useEntityRelationsTypesCount = (id: string, technicalName: string) => {
    const {
        state: { user },
    } = useAuth()
    const isUserLogged = !!user
    const { isLoading, isError, data: countData } = useReadNeighboursConfigurationItemsCount(id)
    const { isLoading: isRelatedLoading, isError: isRelatedError, data: relatedData } = useListRelatedCiTypes(technicalName)

    const relatedCiTypesFilteredForView = useMemo((): RelatedCiTypePreviewList => {
        const filteredSources = relatedData?.cisAsSources?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged))
        const filteredTargets = relatedData?.cisAsTargets?.filter((relatedType) => isRelatedCiTypeCmdbView(relatedType, isUserLogged))
        const relatedCiTypesFilteredData: RelatedCiTypePreviewList = { cisAsSources: filteredSources, cisAsTargets: filteredTargets }
        return relatedCiTypesFilteredData
    }, [relatedData, isUserLogged])

    const allRelationRaw = [...(relatedCiTypesFilteredForView?.cisAsSources ?? []), ...(relatedCiTypesFilteredForView?.cisAsTargets ?? [])]
    const allRelation = removeDuplicates(allRelationRaw, 'ciTypeTechnicalName')

    if (allRelation == undefined) {
        return {
            isLoading: false,
            isError: false,
            data: undefined,
            keysToDisplay: undefined,
        }
    }

    const keysToDisplay: IKeyToDisplay[] = allRelation
        .map((relation) => {
            const typeName = relation.ciTypeName
            const count = countData?.[relation?.ciTypeTechnicalName ?? ''] ?? 0
            return {
                tabName: `${typeName ?? ''} (${count})`,
                technicalName: relation.ciTypeTechnicalName ?? '',
                count,
            }
        })
        ?.filter((tab) => tab?.tabName !== '' && tab?.count > 0)

    const keysToDisplaySorted = keysToDisplay.sort((a, b) => (a.count > b.count ? -1 : 1))

    return {
        isLoading: isLoading || isRelatedLoading,
        isError: isError || isRelatedError,
        data: allRelation,
        keysToDisplay: keysToDisplaySorted,
    }
}
